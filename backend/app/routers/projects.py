from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.project import Project
from ..database import get_session
from datetime import datetime

router = APIRouter()

# Project 생성
@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: Project, session: Session = Depends(get_session)):
    # parent_type 유효성 검사 (항상)
    if project.parent_type != 'goal':
        raise HTTPException(status_code=400, detail="Project의 parent_type은 'goal'만 허용됩니다.")
    # parent_id 유효성 검사
    if project.parent_id is not None:
        if project.parent_id == project.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        from ..models.goal import Goal
        parent = session.get(Goal, project.parent_id)
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Goal이 존재하지 않습니다.")
    project.created_at = datetime.utcnow()
    project.updated_at = datetime.utcnow()
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

# Project 전체 조회
@router.get("/", response_model=List[Project])
def read_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project).where(Project.deleted == False)).all()
    return projects

# Project 단일 조회
@router.get("/{project_id}", response_model=Project)
def read_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project or project.deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Project 수정
@router.put("/{project_id}", response_model=Project)
def update_project(project_id: int, project_update: Project, session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project or db_project.deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    update_data = project_update.model_dump(exclude_unset=True)
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == project_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        if update_data.get("parent_type") != 'goal':
            raise HTTPException(status_code=400, detail="Project의 parent_type은 'goal'만 허용됩니다.")
        from ..models.goal import Goal
        parent = session.get(Goal, update_data["parent_id"])
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Goal이 존재하지 않습니다.")
    for key, value in update_data.items():
        setattr(db_project, key, value)
    db_project.updated_at = datetime.utcnow()
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

# Project 삭제 (soft delete)
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project or db_project.deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    db_project.deleted = True
    db_project.updated_at = datetime.utcnow()
    session.add(db_project)
    session.commit()
    return None 