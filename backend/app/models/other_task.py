from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class OtherTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    parent_id: Optional[int] = Field(default=None)
    parent_type: Optional[str] = Field(default=None)  # 'goal', 'project'
    due_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow) 