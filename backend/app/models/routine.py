from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class Routine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    title: str
    parent_id: Optional[int] = Field(default=None)
    parent_type: Optional[str] = Field(default=None)  # 'goal', 'project'
    start_date: Optional[date] = None
    frequency: Optional[str] = None
    frequency_type: Optional[str] = None
    frequency_days: Optional[str] = None  # JSON 문자열로 저장 (예: '["mon","wed"]')
    frequency_count: Optional[int] = None
    frequency_custom: Optional[str] = None
    category: Optional[str] = None
    performed_count: Optional[int] = 0
    performed_dates: Optional[str] = None  # JSON 문자열로 저장 (예: '[{"date": "2025-06-19", "success": true}]')
    failed_logs: Optional[str] = None      # JSON 문자열로 저장
    difficulty_history: Optional[str] = None  # JSON 문자열로 저장
    history_log: Optional[str] = None         # JSON 문자열로 저장
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow) 