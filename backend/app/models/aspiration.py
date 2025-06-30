from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Aspiration(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    category: Optional[str] = None
    importance: Optional[int] = None
    linked_goal_id: Optional[int] = Field(default=None, foreign_key="goal.id")
    created_at: datetime = Field(default_factory=datetime.utcnow) 