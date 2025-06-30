from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.other_task import OtherTask
from ..database import get_session
from datetime import datetime

router = APIRouter()

# OtherTask 생성
@router.post("/", response_model=OtherTask, status_code=status.HTTP_201_CREATED)
def create_other_task(other_task: OtherTask, session: Session = Depends(get_session)):
    # parent_type 유효성 검사 (항상)
    if other_task.parent_type not in ['goal', 'project']:
        raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project'만 허용됩니다.")
    # parent_id 유효성 검사
    if other_task.parent_id is not None:
        if other_task.parent_id == other_task.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        if other_task.parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, other_task.parent_id)
        elif other_task.parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, other_task.parent_id)
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    other_task.created_at = datetime.utcnow()
    other_task.updated_at = datetime.utcnow()
    session.add(other_task)
    session.commit()
    session.refresh(other_task)
    return other_task

# OtherTask 전체 조회
@router.get("/", response_model=List[OtherTask])
def read_other_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(OtherTask)).all()
    return tasks

# OtherTask 단일 조회
@router.get("/{other_task_id}", response_model=OtherTask)
def read_other_task(other_task_id: int, session: Session = Depends(get_session)):
    task = session.get(OtherTask, other_task_id)
    if not task:
        raise HTTPException(status_code=404, detail="OtherTask not found")
    return task

# OtherTask 수정
@router.put("/{other_task_id}", response_model=OtherTask)
def update_other_task(other_task_id: int, other_task_update: OtherTask, session: Session = Depends(get_session)):
    db_task = session.get(OtherTask, other_task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="OtherTask not found")
    update_data = other_task_update.model_dump(exclude_unset=True)
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == other_task_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        parent_type = update_data.get("parent_type", db_task.parent_type)
        if parent_type not in ['goal', 'project']:
            raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project'만 허용됩니다.")
        if parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, update_data["parent_id"])
        elif parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, update_data["parent_id"])
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

# OtherTask 삭제
@router.delete("/{other_task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_other_task(other_task_id: int, session: Session = Depends(get_session)):
    db_task = session.get(OtherTask, other_task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="OtherTask not found")
    session.delete(db_task)
    session.commit()
    return None 