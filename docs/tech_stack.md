# 📚 todoManager 기술스택 명세서

## 1. 전체 아키텍처 개요
- **백엔드**: FastAPI, SQLModel, PostgreSQL, Alembic, Docker
- **프론트엔드**: React, TypeScript, Vite, styled-components
- **테스트/품질**: Pytest, Playwright, pre-commit, lint
- **배포/운영**: Docker Compose, GitHub Actions
- **확장성**: AI(LangGraph, Gemini 등), 모바일/클라우드 연동 고려

---

## 2. 기술스택 상세 표

| 구분         | 기술/도구         | 역할 및 선택 이유                                                                 |
|--------------|-------------------|----------------------------------------------------------------------------------|
| 백엔드       | FastAPI           | 최신 Python 비동기 웹 프레임워크, 타입 안정성, OpenAPI 자동 문서화, 빠른 개발      |
|              | SQLModel          | SQLAlchemy 기반 타입 안전 ORM, 데이터 모델링 및 마이그레이션 용이                 |
|              | PostgreSQL        | 오픈소스 RDBMS, 트랜잭션/확장성/성능 우수                                         |
|              | Alembic           | DB 마이그레이션 관리                                                              |
|              | Uvicorn           | ASGI 서버, 비동기 처리 지원                                                       |
| 프론트엔드   | React             | 컴포넌트 기반 UI, 대규모 상태 관리, 생산성/유지보수 용이                          |
|              | TypeScript        | 타입 안정성, 대규모 프로젝트에 필수                                               |
|              | Vite              | 빠른 개발 서버, 빌드 속도 우수                                                    |
|              | styled-components | CSS-in-JS, 컴포넌트 단위 스타일, 동적 스타일링, 테마 지원                        |
| 품질/테스트  | Pytest            | Python 테스트 프레임워크                                                          |
|              | pre-commit        | 커밋 전 코드 품질 자동 체크                                                       |
|              | ESLint/Prettier   | JS/TS 코드 스타일 및 린트                                                         |
| 배포/운영    | Docker            | 개발/운영 환경 일관성, 멀티 컨테이너 관리                                         |
|              | Docker Compose    | 전체 스택 통합 관리                                                               |
|              | GitHub Actions    | CI/CD 자동화, 테스트/배포 파이프라인                                              |
| 확장성       | LangGraph, Gemini | AI 추천/자동화, 대화형 에이전트 등 확장 가능                                      |

---

## 3. 각 기술별 주요 역할 및 특징

### 백엔드
- **FastAPI**: 비동기 처리, 타입 기반 자동 문서화, 빠른 API 개발
- **SQLModel**: 데이터 모델 정의와 마이그레이션을 쉽게 지원
- **PostgreSQL**: 신뢰성 높은 데이터 저장소, 확장성 우수
- **Alembic**: DB 스키마 버전 관리
- **Uvicorn**: 고성능 ASGI 서버

### 프론트엔드
- **React**: 트리 구조, 대시보드, 분석 등 복잡한 UI 구현에 적합
- **TypeScript**: 런타임 오류 감소, 유지보수성 향상
- **Vite**: 빠른 HMR, 빌드 속도, 최신 프론트엔드 개발 환경
- **styled-components**: CSS-in-JS, 컴포넌트 단위 스타일, 동적 스타일링, 테마 지원

### 품질/테스트
- **Pytest**: 백엔드 단위/통합 테스트
- **pre-commit**: 코드 스타일, 린트, 포맷 자동화
- **ESLint/Prettier**: 프론트엔드 코드 품질 유지

### 배포/운영
- **Docker/Docker Compose**: 개발-운영 환경 일치, 멀티 서비스 관리
- **GitHub Actions**: 자동화된 테스트/배포 파이프라인

### 확장성
- **LangGraph, Gemini**: AI 추천, 자동화, 대화형 에이전트 등 미래 확장 고려

---

## 4. 참고 템플릿/레퍼런스
- [FastAPI Full Stack Template](https://github.com/tiangolo/full-stack-fastapi-template)
- [Litestar Fullstack Reference](https://github.com/litestar-org/litestar-fullstack)
- [Google Gemini LangGraph Quickstart](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart)

---

> 이 문서는 최신 트렌드와 context7 기반 추천을 반영하여, todoManager 시스템의 기술스택을 명확히 정의합니다. 추가 요구사항이나 변경이 필요하면 언제든 업데이트 가능합니다. 