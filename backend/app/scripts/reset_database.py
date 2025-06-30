import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

# .env에서 DATABASE_URL 읽기
load_dotenv("D:/projects/todoManager/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def reset_database():
    """데이터베이스를 완전히 초기화합니다 (테이블 구조까지 삭제)"""
    # 모든 테이블 삭제
    SQLModel.metadata.drop_all(engine)
    print("모든 테이블이 삭제되었습니다.")
    
    # 모든 테이블 새로 생성
    SQLModel.metadata.create_all(engine)
    print("모든 테이블이 새로 생성되었습니다.")
    
    print("데이터베이스가 완전히 초기화되었습니다.")

if __name__ == "__main__":
    reset_database() 