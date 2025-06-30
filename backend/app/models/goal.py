from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Goal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    parent_id: Optional[int] = Field(default=None, foreign_key="goal.id")
    description: Optional[str] = None
    order: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted: bool = Field(default=False)
    is_milestone: bool = Field(default=False)

    # 트리 구조(자기참조)
    children: List["Goal"] = Relationship(back_populates="parent")
    parent: Optional["Goal"] = Relationship(back_populates="children", sa_relationship_kwargs={"remote_side": "Goal.id"}) 