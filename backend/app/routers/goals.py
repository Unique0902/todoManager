from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
from ..models.goal import Goal
from ..models.project import Project
from ..models.task import Task
from ..models.routine import Routine
from ..models.milestone_group import MilestoneGroup
from ..models.other_task import OtherTask
from ..database import get_session
from datetime import datetime

router = APIRouter()

# Goal 생성
@router.post("/", response_model=Goal, status_code=status.HTTP_201_CREATED)
def create_goal(goal: Goal, session: Session = Depends(get_session)):
    # parent_id 유효성 검사
    if goal.parent_id is not None:
        if goal.parent_id == goal.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        parent = session.get(Goal, goal.parent_id)
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Goal이 존재하지 않습니다.")
    goal.created_at = datetime.utcnow()
    goal.updated_at = datetime.utcnow()
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal

# Goal 전체 조회
@router.get("/", response_model=List[Goal])
def read_goals(session: Session = Depends(get_session)):
    goals = session.exec(select(Goal).where(Goal.deleted == False)).all()
    return goals

# Goal 단일 조회
@router.get("/{goal_id}", response_model=Goal)
def read_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal or goal.deleted:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

# Goal 수정
@router.put("/{goal_id}", response_model=Goal)
def update_goal(goal_id: int, goal_update: Goal, session: Session = Depends(get_session)):
    db_goal = session.get(Goal, goal_id)
    if not db_goal or db_goal.deleted:
        raise HTTPException(status_code=404, detail="Goal not found")
    update_data = goal_update.model_dump(exclude_unset=True)
    # parent_id 유효성 검사
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == goal_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        parent = session.get(Goal, update_data["parent_id"])
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Goal이 존재하지 않습니다.")
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    db_goal.updated_at = datetime.utcnow()
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

# Goal 삭제 (soft delete)
@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, session: Session = Depends(get_session)):
    db_goal = session.get(Goal, goal_id)
    if not db_goal or db_goal.deleted:
        raise HTTPException(status_code=404, detail="Goal not found")
    db_goal.deleted = True
    db_goal.updated_at = datetime.utcnow()
    session.add(db_goal)
    session.commit()
    return None

# Goal 트리 구조 조회 (수정: parent_type 체크, 순환 참조 방지)
@router.get("/{goal_id}/tree", response_model=Dict[str, Any])
def get_goal_tree(goal_id: int, session: Session = Depends(get_session)):
    def build_tree(node, visited):
        if node.id in visited:
            return None  # 순환 참조 방지
        visited.add(node.id)
        node_type = node.type
        children = []
        
        # Goal의 자식들
        if node_type == 'goal':
            # Goal 자식 Goal
            goals = session.exec(select(Goal).where(Goal.parent_id == node.id, Goal.deleted == False)).all()
            children += [c for c in (build_tree(child, visited) for child in goals) if c]
            # Goal 자식 Project
            projects = session.exec(select(Project).where(Project.parent_id == node.id, Project.parent_type == 'goal', Project.deleted == False)).all()
            children += [c for c in (build_tree(child, visited) for child in projects) if c]
            # Goal 자식 Task
            tasks = session.exec(select(Task).where(Task.parent_id == node.id, Task.parent_type == 'goal')).all()
            children += [c for c in (build_tree(child, visited) for child in tasks) if c]
            # Goal 자식 Routine
            routines = session.exec(select(Routine).where(Routine.parent_id == node.id, Routine.parent_type == 'goal')).all()
            children += [c for c in (build_tree(child, visited) for child in routines) if c]
            # Goal 자식 MilestoneGroup
            milestone_groups = session.exec(select(MilestoneGroup).where(MilestoneGroup.parent_id == node.id, MilestoneGroup.parent_type == 'goal')).all()
            children += [c for c in (build_tree(child, visited) for child in milestone_groups) if c]
            # Goal 자식 OtherTask
            other_tasks = session.exec(select(OtherTask).where(OtherTask.parent_id == node.id, OtherTask.parent_type == 'goal')).all()
            children += [c for c in (build_tree(child, visited) for child in other_tasks) if c]
        
        # Project의 자식들
        elif node_type == 'project':
            # Project 자식 Task
            tasks = session.exec(select(Task).where(Task.parent_id == node.id, Task.parent_type == 'project')).all()
            children += [c for c in (build_tree(child, visited) for child in tasks) if c]
            # Project 자식 Routine
            routines = session.exec(select(Routine).where(Routine.parent_id == node.id, Routine.parent_type == 'project')).all()
            children += [c for c in (build_tree(child, visited) for child in routines) if c]
            # Project 자식 MilestoneGroup
            milestone_groups = session.exec(select(MilestoneGroup).where(MilestoneGroup.parent_id == node.id, MilestoneGroup.parent_type == 'project')).all()
            children += [c for c in (build_tree(child, visited) for child in milestone_groups) if c]
            # Project 자식 OtherTask
            other_tasks = session.exec(select(OtherTask).where(OtherTask.parent_id == node.id, OtherTask.parent_type == 'project')).all()
            children += [c for c in (build_tree(child, visited) for child in other_tasks) if c]
        
        # MilestoneGroup의 자식들
        elif node_type == 'milestone_group':
            # MilestoneGroup 자식 Task
            tasks = session.exec(select(Task).where(Task.parent_id == node.id, Task.parent_type == 'milestone_group')).all()
            children += [c for c in (build_tree(child, visited) for child in tasks) if c]
        
        return {
            "id": node.id,
            "type": node_type,
            "title": node.title,
            "children": children
        }
    goal = session.get(Goal, goal_id)
    if not goal or goal.deleted:
        raise HTTPException(status_code=404, detail="Goal not found")
    return build_tree(goal, set()) 