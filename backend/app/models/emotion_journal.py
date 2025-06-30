from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class EmotionJournal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    mood_tag: Optional[str] = None
    linked_routine_id: Optional[int] = Field(default=None, foreign_key="routine.id") 