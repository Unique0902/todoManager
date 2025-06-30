from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    parent_id: Optional[int] = Field(default=None)
    parent_type: Optional[str] = Field(default=None)  # 'goal'
    description: Optional[str] = None
    order: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted: bool = Field(default=False)
    is_milestone: bool = Field(default=False) 