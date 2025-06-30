from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from ..models.emotion_journal import EmotionJournal
from ..database import get_session
from datetime import datetime

router = APIRouter()

# EmotionJournal 생성
@router.post("/", response_model=EmotionJournal, status_code=status.HTTP_201_CREATED)
def create_emotion_journal(journal: EmotionJournal, session: Session = Depends(get_session)):
    journal.created_at = datetime.utcnow()
    session.add(journal)
    session.commit()
    session.refresh(journal)
    return journal

# EmotionJournal 전체 조회
@router.get("/", response_model=List[EmotionJournal])
def read_emotion_journals(session: Session = Depends(get_session)):
    journals = session.exec(select(EmotionJournal)).all()
    return journals

# EmotionJournal 단일 조회
@router.get("/{journal_id}", response_model=EmotionJournal)
def read_emotion_journal(journal_id: int, session: Session = Depends(get_session)):
    journal = session.get(EmotionJournal, journal_id)
    if not journal:
        raise HTTPException(status_code=404, detail="EmotionJournal not found")
    return journal

# EmotionJournal 수정
@router.put("/{journal_id}", response_model=EmotionJournal)
def update_emotion_journal(journal_id: int, journal_update: EmotionJournal, session: Session = Depends(get_session)):
    db_journal = session.get(EmotionJournal, journal_id)
    if not db_journal:
        raise HTTPException(status_code=404, detail="EmotionJournal not found")
    update_data = journal_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_journal, key, value)
    session.add(db_journal)
    session.commit()
    session.refresh(db_journal)
    return db_journal

# EmotionJournal 삭제
@router.delete("/{journal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_emotion_journal(journal_id: int, session: Session = Depends(get_session)):
    db_journal = session.get(EmotionJournal, journal_id)
    if not db_journal:
        raise HTTPException(status_code=404, detail="EmotionJournal not found")
    session.delete(db_journal)
    session.commit()
    return None 