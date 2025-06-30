from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from .routers import goals, projects, tasks, routines, milestone_groups, other_tasks, aspirations, emotion_journals

# 환경변수 로드
load_dotenv("D:/projects/todoManager/.env")

# 라우터 import (추후 추가)
# from .routers import goals, projects, tasks, routines

@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # 시작 시 실행
    print("🚀 todoManager API 서버가 시작되었습니다.")
    yield
    # 종료 시 실행
    print("👋 todoManager API 서버가 종료되었습니다.")

# FastAPI 애플리케이션 생성
app = FastAPI(
    title="todoManager API",
    description="목표, 프로젝트, 마일스톤, 루틴, 할일 등을 트리 구조로 관리하는 자기관리 시스템 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경에서는 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 전역 예외 처리
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "내부 서버 오류가 발생했습니다."}
    )

# 헬스체크 엔드포인트
@app.get("/health", tags=["Health"])
async def health_check():
    """서버 상태 확인"""
    return {
        "success": True,
        "message": "서버가 정상적으로 작동 중입니다.",
        "data": {
            "status": "healthy",
            "version": "1.0.0",
            "timestamp": "2025-06-30T10:00:00Z"
        }
    }

# 루트 엔드포인트
@app.get("/", tags=["Root"])
async def root():
    """API 루트 엔드포인트"""
    return {
        "success": True,
        "message": "todoManager API에 오신 것을 환영합니다!",
        "data": {
            "title": "todoManager API",
            "version": "1.0.0",
            "description": "목표, 프로젝트, 마일스톤, 루틴, 할일 등을 트리 구조로 관리하는 자기관리 시스템",
            "docs_url": "/docs",
            "redoc_url": "/redoc",
            "endpoints": {
                "goals": "/api/v1/goals",
                "projects": "/api/v1/projects",
                "tasks": "/api/v1/tasks",
                "routines": "/api/v1/routines"
            }
        }
    }

# 라우터 등록 (추후 추가)
app.include_router(goals.router, prefix="/api/v1/goals", tags=["Goals"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(routines.router, prefix="/api/v1/routines", tags=["Routines"])
app.include_router(milestone_groups.router, prefix="/api/v1/milestone-groups", tags=["MilestoneGroups"])
app.include_router(other_tasks.router, prefix="/api/v1/other-tasks", tags=["OtherTasks"])
app.include_router(aspirations.router, prefix="/api/v1/aspirations", tags=["Aspirations"])
app.include_router(emotion_journals.router, prefix="/api/v1/emotion-journals", tags=["EmotionJournals"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 