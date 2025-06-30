from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.aspiration import Aspiration
from ..database import get_session
from datetime import datetime

router = APIRouter()

# Aspiration 생성
@router.post("/", response_model=Aspiration, status_code=status.HTTP_201_CREATED)
def create_aspiration(aspiration: Aspiration, session: Session = Depends(get_session)):
    aspiration.created_at = datetime.utcnow()
    session.add(aspiration)
    session.commit()
    session.refresh(aspiration)
    return aspiration

# Aspiration 전체 조회
@router.get("/", response_model=List[Aspiration])
def read_aspirations(session: Session = Depends(get_session)):
    aspirations = session.exec(select(Aspiration)).all()
    return aspirations

# Aspiration 단일 조회
@router.get("/{aspiration_id}", response_model=Aspiration)
def read_aspiration(aspiration_id: int, session: Session = Depends(get_session)):
    aspiration = session.get(Aspiration, aspiration_id)
    if not aspiration:
        raise HTTPException(status_code=404, detail="Aspiration not found")
    return aspiration

# Aspiration 수정
@router.put("/{aspiration_id}", response_model=Aspiration)
def update_aspiration(aspiration_id: int, aspiration_update: Aspiration, session: Session = Depends(get_session)):
    db_aspiration = session.get(Aspiration, aspiration_id)
    if not db_aspiration:
        raise HTTPException(status_code=404, detail="Aspiration not found")
    update_data = aspiration_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_aspiration, key, value)
    session.add(db_aspiration)
    session.commit()
    session.refresh(db_aspiration)
    return db_aspiration

# Aspiration 삭제
@router.delete("/{aspiration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_aspiration(aspiration_id: int, session: Session = Depends(get_session)):
    db_aspiration = session.get(Aspiration, aspiration_id)
    if not db_aspiration:
        raise HTTPException(status_code=404, detail="Aspiration not found")
    session.delete(db_aspiration)
    session.commit()
    return None 