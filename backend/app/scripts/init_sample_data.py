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
from datetime import date, datetime

# .env에서 DATABASE_URL 읽기 - 간단한 절대 경로 사용
load_dotenv("D:/projects/todoManager/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_sample():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # 1. 목표(Goal) 2개 생성
        goal1 = Goal(type="goal", title="건강한 삶")
        goal2 = Goal(type="goal", title="나만의 서비스 만들기")
        session.add_all([goal1, goal2])
        session.commit()
        session.refresh(goal1)
        session.refresh(goal2)

        # 2. 프로젝트(Project) 2개 생성
        project1 = Project(type="project", title="12주 운동 챌린지", parent_id=goal1.id, parent_type="goal")
        project2 = Project(type="project", title="할일 정리 앱 개발", parent_id=goal2.id, parent_type="goal")
        session.add_all([project1, project2])
        session.commit()
        session.refresh(project1)
        session.refresh(project2)

        # 3. 마일스톤 그룹(MilestoneGroup) 2개 생성
        mg1 = MilestoneGroup(type="milestone_group", title="주차별 목표", parent_id=project1.id, parent_type="project")
        mg2 = MilestoneGroup(type="milestone_group", title="개발 단계", parent_id=project2.id, parent_type="project")
        session.add_all([mg1, mg2])
        session.commit()
        session.refresh(mg1)
        session.refresh(mg2)

        # 4. 마일스톤(Task, is_milestone) 및 일반 Task 생성
        t1 = Task(type="task", title="1주차 완료", parent_id=mg1.id, parent_type="milestone_group", is_milestone=True, order_index=1)
        t2 = Task(type="task", title="2주차 완료", parent_id=mg1.id, parent_type="milestone_group", is_milestone=True, order_index=2)
        t3 = Task(type="task", title="운동 계획 세우기", parent_id=project1.id, parent_type="project")
        t4 = Task(type="task", title="MVP UI 완성", parent_id=mg2.id, parent_type="milestone_group", is_milestone=True, order_index=1)
        t5 = Task(type="task", title="기본 기능 구현", parent_id=mg2.id, parent_type="milestone_group", is_milestone=True, order_index=2)
        t6 = Task(type="task", title="디자인 시안 확정", parent_id=project2.id, parent_type="project")
        session.add_all([t1, t2, t3, t4, t5, t6])

        # 5. 기타할일(OtherTask) 2개 생성
        ot1 = OtherTask(type="other_task", title="병원 예약", parent_id=goal1.id, parent_type="goal", due_date=date.today())
        ot2 = OtherTask(type="other_task", title="친구 생일 파티", parent_id=project2.id, parent_type="project", due_date=date.today())
        session.add_all([ot1, ot2])

        # 6. 루틴(Routine) 2개 생성
        routine1 = Routine(
            type="routine",
            title="매일 30분 운동",
            parent_id=project1.id,
            parent_type="project",
            start_date=date.today(),
            frequency="매일",
            category="운동",
            performed_dates='[{"date": "2025-07-01", "success": true}]',
            failed_logs='[{"date": "2025-07-02", "reason": "피곤함", "mood": "무기력", "context": "야근"}]'
        )
        routine2 = Routine(
            type="routine",
            title="매일 1시간 코딩",
            parent_id=project2.id,
            parent_type="project",
            start_date=date.today(),
            frequency="매일",
            category="학습",
            performed_dates='[{"date": "2025-07-01", "success": true}, {"date": "2025-07-02", "success": true}]',
            failed_logs='[]'
        )
        session.add_all([routine1, routine2])

        # 7. 아이디어/버킷리스트(Aspiration) 2개 생성
        asp1 = Aspiration(type="aspiration", title="스카이다이빙 도전", category="도전", importance=5, linked_goal_id=goal1.id)
        asp2 = Aspiration(type="aspiration", title="책 100권 읽기", category="학습", importance=4, linked_goal_id=None)
        session.add_all([asp1, asp2])

        # 8. 감정일기(EmotionJournal) 2개 생성
        ej1 = EmotionJournal(date=date.today(), content="오늘 운동을 못해서 아쉬움", created_at=datetime.now(), mood_tag="아쉬움", linked_routine_id=None)
        ej2 = EmotionJournal(date=date.today(), content="코딩하며 성취감 느낌", created_at=datetime.now(), mood_tag="성취감", linked_routine_id=None)
        session.add_all([ej1, ej2])

        session.commit()
        print("전체 모델을 아우르는 샘플 데이터가 성공적으로 삽입되었습니다.")

if __name__ == "__main__":
    init_sample() 