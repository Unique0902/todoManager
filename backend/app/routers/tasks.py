from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.task import Task
from ..database import get_session
from datetime import datetime
import json

router = APIRouter()

# Task 생성
@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: Task, session: Session = Depends(get_session)):
    # parent_type 유효성 검사 (항상)
    if task.parent_type not in ['goal', 'project', 'milestone_group']:
        raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project', 'milestone_group'만 허용됩니다.")
    # parent_id 유효성 검사
    if task.parent_id is not None:
        if task.parent_id == task.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        if task.parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, task.parent_id)
        elif task.parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, task.parent_id)
        elif task.parent_type == 'milestone_group':
            from ..models.milestone_group import MilestoneGroup
            parent = session.get(MilestoneGroup, task.parent_id)
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    task.created_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

# Task 전체 조회
@router.get("/", response_model=List[Task])
def read_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(Task).order_by(Task.id)).all()
    return tasks

# Task 단일 조회
@router.get("/{task_id}", response_model=Task)
def read_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# Task 수정
@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: Task, session: Session = Depends(get_session)):
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    update_data = task_update.model_dump(exclude_unset=True)
    # parent_id 유효성 검사 등 기존 코드 유지
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == task_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        parent_type = update_data.get("parent_type", db_task.parent_type)
        if parent_type not in ['goal', 'project', 'milestone_group']:
            raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project', 'milestone_group'만 허용됩니다.")
        if parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, update_data["parent_id"])
        elif parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, update_data["parent_id"])
        elif parent_type == 'milestone_group':
            from ..models.milestone_group import MilestoneGroup
            parent = session.get(MilestoneGroup, update_data["parent_id"])
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    # history_log: due_date 변경 시 이력 append
    old_due_date = db_task.due_date
    new_due_date = update_data.get("due_date", old_due_date)
    if old_due_date != new_due_date:
        try:
            history = json.loads(db_task.history_log or "[]")
        except Exception:
            history = []
        history.append({
            "changed_at": datetime.utcnow().isoformat(),
            "field": "due_date",
            "before": str(old_due_date),
            "after": str(new_due_date),
            "reason": update_data.get("history_reason", "날짜 변경")
        })
        db_task.history_log = json.dumps(history, ensure_ascii=False)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

# Task 삭제 (soft delete)
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(db_task)
    session.commit()
    return None 