from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool
import os
from dotenv import load_dotenv
from contextlib import contextmanager
from typing import Generator

# 환경변수 로드
load_dotenv("D:/projects/todoManager/.env")

# 데이터베이스 URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL 환경변수가 설정되지 않았습니다.")

# 엔진 생성
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "false").lower() == "true",  # 디버그 모드에서만 SQL 로그 출력
    pool_pre_ping=True,  # 연결 상태 확인
    pool_recycle=3600,   # 1시간마다 연결 재생성
)

def create_db_and_tables():
    """데이터베이스 테이블 생성"""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """데이터베이스 세션 생성"""
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

@contextmanager
def get_db_session():
    """컨텍스트 매니저로 데이터베이스 세션 관리"""
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

# 데이터베이스 연결 테스트
def test_connection():
    """데이터베이스 연결 테스트"""
    try:
        with Session(engine) as session:
            session.execute("SELECT 1")
        print("✅ 데이터베이스 연결이 성공했습니다.")
        return True
    except Exception as e:
        print(f"❌ 데이터베이스 연결에 실패했습니다: {e}")
        return False

if __name__ == "__main__":
    # 연결 테스트 실행
    test_connection() 