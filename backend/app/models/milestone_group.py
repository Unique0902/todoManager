from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class MilestoneGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    parent_id: Optional[int] = Field(default=None)
    parent_type: Optional[str] = Field(default=None)  # 'project'
    order: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow) 