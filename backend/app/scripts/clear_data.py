import os
from sqlmodel import Session, SQLModel, create_engine
from backend.app.models.goal import Goal
from backend.app.models.project import Project
from backend.app.models.milestone_group import MilestoneGroup
from backend.app.models.task import Task
from backend.app.models.other_task import OtherTask
from backend.app.models.routine import Routine
from backend.app.models.aspiration import Aspiration
from backend.app.models.emotion_journal import EmotionJournal
from dotenv import load_dotenv

# .env에서 DATABASE_URL 읽기
load_dotenv("D:/projects/todoManager/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def clear_data():
    """모든 테이블의 데이터를 삭제합니다 (테이블 구조는 유지)"""
    with Session(engine) as session:
        # 외래키 제약조건 때문에 삭제 순서가 중요합니다
        # 자식 테이블부터 삭제
        session.query(EmotionJournal).delete()
        session.query(Aspiration).delete()
        session.query(Task).delete()
        session.query(OtherTask).delete()
        session.query(Routine).delete()
        session.query(MilestoneGroup).delete()
        session.query(Project).delete()
        session.query(Goal).delete()
        
        session.commit()
        print("모든 데이터가 성공적으로 삭제되었습니다.")

if __name__ == "__main__":
    clear_data() 