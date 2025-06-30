from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.milestone_group import MilestoneGroup
from ..database import get_session
from datetime import datetime

router = APIRouter()

# MilestoneGroup 생성
@router.post("/", response_model=MilestoneGroup, status_code=status.HTTP_201_CREATED)
def create_milestone_group(group: MilestoneGroup, session: Session = Depends(get_session)):
    # parent_type 유효성 검사 (항상)
    if group.parent_type != 'project':
        raise HTTPException(status_code=400, detail="MilestoneGroup의 parent_type은 'project'만 허용됩니다.")
    # parent_id 유효성 검사
    if group.parent_id is not None:
        if group.parent_id == group.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        from ..models.project import Project
        parent = session.get(Project, group.parent_id)
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Project가 존재하지 않습니다.")
    group.created_at = datetime.utcnow()
    group.updated_at = datetime.utcnow()
    session.add(group)
    session.commit()
    session.refresh(group)
    return group

# MilestoneGroup 전체 조회
@router.get("/", response_model=List[MilestoneGroup])
def read_milestone_groups(session: Session = Depends(get_session)):
    groups = session.exec(select(MilestoneGroup)).all()
    return groups

# MilestoneGroup 단일 조회
@router.get("/{group_id}", response_model=MilestoneGroup)
def read_milestone_group(group_id: int, session: Session = Depends(get_session)):
    group = session.get(MilestoneGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="MilestoneGroup not found")
    return group

# MilestoneGroup 수정
@router.put("/{group_id}", response_model=MilestoneGroup)
def update_milestone_group(group_id: int, group_update: MilestoneGroup, session: Session = Depends(get_session)):
    db_group = session.get(MilestoneGroup, group_id)
    if not db_group:
        raise HTTPException(status_code=404, detail="MilestoneGroup not found")
    update_data = group_update.model_dump(exclude_unset=True)
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == group_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        if update_data.get("parent_type") != 'project':
            raise HTTPException(status_code=400, detail="MilestoneGroup의 parent_type은 'project'만 허용됩니다.")
        from ..models.project import Project
        parent = session.get(Project, update_data["parent_id"])
        if not parent or parent.deleted:
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 Project가 존재하지 않습니다.")
    for key, value in update_data.items():
        setattr(db_group, key, value)
    db_group.updated_at = datetime.utcnow()
    session.add(db_group)
    session.commit()
    session.refresh(db_group)
    return db_group

# MilestoneGroup 삭제
@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_milestone_group(group_id: int, session: Session = Depends(get_session)):
    db_group = session.get(MilestoneGroup, group_id)
    if not db_group:
        raise HTTPException(status_code=404, detail="MilestoneGroup not found")
    session.delete(db_group)
    session.commit()
    return None 