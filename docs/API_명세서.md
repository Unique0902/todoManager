# 📋 todoManager API 명세서 (OpenAPI 3.0)

**버전**: 1.0.0  
**마지막 업데이트**: 2025-06-30  
**기술 스택**: FastAPI, Pydantic v2, SQLModel, OpenAPI 3.0

---

## 🎯 API 개요

### 기본 정보
- **제목**: todoManager API
- **설명**: 목표, 프로젝트, 마일스톤, 루틴, 할일 등을 트리 구조로 관리하는 자기관리 시스템 API
- **버전**: 1.0.0
- **서버 URL**: `http://localhost:8000`
- **문서 URL**: `http://localhost:8000/docs` (Swagger UI)
- **대안 문서**: `http://localhost:8000/redoc` (ReDoc)

### 인증
- **현재**: 인증 없음 (개발 단계)
- **향후**: JWT 토큰 기반 인증 예정

---

## 🏗️ API 구조

### 기본 경로
```
/api/v1/
```

### 리소스별 엔드포인트
- **Goals**: `/api/v1/goals`
- **Projects**: `/api/v1/projects`
- **Tasks**: `/api/v1/tasks`
- **Routines**: `/api/v1/routines`
- **Milestone Groups**: `/api/v1/milestone-groups`
- **Other Tasks**: `/api/v1/other-tasks`
- **Aspirations**: `/api/v1/aspirations`
- **Emotion Journals**: `/api/v1/emotion-journals`

---

## 📊 데이터 모델 (Pydantic v2)

### 공통 응답 모델
```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List
from datetime import datetime

T = TypeVar('T')

class PaginationInfo(BaseModel):
    page: int
    size: int
    total: int
    total_pages: int

class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    pagination: Optional[PaginationInfo] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str
    details: Optional[dict] = None
```

### Goal 모델
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="목표 제목")
    description: Optional[str] = Field(None, max_length=1000, description="목표 설명")
    is_milestone: bool = Field(default=False, description="마일스톤 여부")
    order: Optional[int] = Field(None, ge=0, description="정렬 순서")

class GoalCreate(GoalBase):
    parent_id: Optional[int] = Field(None, description="부모 목표 ID")

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    is_milestone: Optional[bool] = None
    order: Optional[int] = Field(None, ge=0)
    parent_id: Optional[int] = None

class GoalResponse(GoalBase):
    id: int
    type: str = "goal"
    parent_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    deleted: bool = False
    children_count: int = Field(0, description="하위 노드 개수")
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0, description="진행률")

class GoalTreeResponse(GoalResponse):
    children: List['GoalTreeResponse'] = []
```

### Project 모델
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    start_date: Optional[date] = Field(None, description="시작일")
    end_date: Optional[date] = Field(None, description="종료일")
    is_milestone: bool = Field(default=False)
    order: Optional[int] = Field(None, ge=0)

class ProjectCreate(ProjectBase):
    parent_id: int = Field(..., description="부모 목표 ID")
    parent_type: str = Field("goal", description="부모 타입")

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_milestone: Optional[bool] = None
    order: Optional[int] = Field(None, ge=0)

class ProjectResponse(ProjectBase):
    id: int
    type: str = "project"
    parent_id: int
    parent_type: str
    created_at: datetime
    updated_at: datetime
    deleted: bool = False
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0)
    days_remaining: Optional[int] = Field(None, description="남은 일수")
```

### Task 모델
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    due_date: Optional[date] = Field(None, description="마감일")
    is_milestone: bool = Field(default=False)
    order_index: Optional[int] = Field(None, ge=0, description="마일스톤 그룹 내 순서")

class TaskCreate(TaskBase):
    parent_id: int = Field(..., description="부모 노드 ID")
    parent_type: str = Field(..., description="부모 타입 (goal/project/milestone_group)")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    due_date: Optional[date] = None
    checked: Optional[bool] = None
    is_milestone: Optional[bool] = None
    order_index: Optional[int] = Field(None, ge=0)

class TaskResponse(TaskBase):
    id: int
    type: str = "task"
    parent_id: int
    parent_type: str
    checked: bool = False
    milestone_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    days_until_due: Optional[int] = Field(None, description="마감까지 남은 일수")
```

### Routine 모델
```python
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class RoutineBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    start_date: Optional[date] = Field(None, description="시작일")
    frequency: Optional[str] = Field(None, description="빈도 (매일/매주/매월)")
    category: Optional[str] = Field(None, max_length=100, description="카테고리")

class RoutineCreate(RoutineBase):
    parent_id: int = Field(..., description="부모 노드 ID")
    parent_type: str = Field(..., description="부모 타입")

class RoutineUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    start_date: Optional[date] = None
    frequency: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)

class RoutineResponse(RoutineBase):
    id: int
    type: str = "routine"
    parent_id: int
    parent_type: str
    performed_count: int = 0
    performed_dates: Optional[str] = None  # JSON 문자열
    failed_logs: Optional[str] = None      # JSON 문자열
    difficulty_history: Optional[str] = None  # JSON 문자열
    history_log: Optional[str] = None         # JSON 문자열
    created_at: datetime
    updated_at: datetime
    completion_rate: float = Field(0.0, ge=0.0, le=100.0, description="수행률")
    streak_days: int = Field(0, description="연속 성공 일수")
```

---

## 🔗 API 엔드포인트 상세

### Goals API

#### 1. 목표 목록 조회
```http
GET /api/v1/goals
```

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `size`: 페이지 크기 (기본값: 20, 최대: 100)
- `parent_id`: 부모 ID로 필터링
- `is_milestone`: 마일스톤 여부로 필터링
- `search`: 제목/설명 검색
- `order_by`: 정렬 기준 (created_at, updated_at, title)
- `order`: 정렬 방향 (asc, desc)

**응답:**
```json
{
  "success": true,
  "message": "목표 목록을 성공적으로 조회했습니다.",
  "data": [
    {
      "id": 1,
      "type": "goal",
      "title": "건강한 삶",
      "description": "전반적인 건강 관리",
      "parent_id": null,
      "is_milestone": false,
      "order": 1,
      "created_at": "2025-06-30T10:00:00Z",
      "updated_at": "2025-06-30T10:00:00Z",
      "deleted": false,
      "children_count": 2,
      "progress_percentage": 65.5
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

#### 2. 목표 트리 구조 조회
```http
GET /api/v1/goals/tree
```

**쿼리 파라미터:**
- `root_id`: 루트 목표 ID (기본값: 최상위 목표들)
- `depth`: 트리 깊이 (기본값: 3, 최대: 5)
- `include_routines`: 루틴 포함 여부 (기본값: true)
- `include_tasks`: 할일 포함 여부 (기본값: true)

**응답:**
```json
{
  "success": true,
  "message": "목표 트리를 성공적으로 조회했습니다.",
  "data": [
    {
      "id": 1,
      "type": "goal",
      "title": "건강한 삶",
      "description": "전반적인 건강 관리",
      "parent_id": null,
      "is_milestone": false,
      "order": 1,
      "created_at": "2025-06-30T10:00:00Z",
      "updated_at": "2025-06-30T10:00:00Z",
      "deleted": false,
      "children_count": 2,
      "progress_percentage": 65.5,
      "children": [
        {
          "id": 2,
          "type": "project",
          "title": "12주 운동 챌린지",
          "parent_id": 1,
          "parent_type": "goal",
          "start_date": "2025-06-30",
          "end_date": "2025-09-21",
          "is_milestone": false,
          "order": 1,
          "created_at": "2025-06-30T10:00:00Z",
          "updated_at": "2025-06-30T10:00:00Z",
          "deleted": false,
          "progress_percentage": 45.0,
          "days_remaining": 83
        }
      ]
    }
  ]
}
```

#### 3. 목표 상세 조회
```http
GET /api/v1/goals/{goal_id}
```

**응답:**
```json
{
  "success": true,
  "message": "목표를 성공적으로 조회했습니다.",
  "data": {
    "id": 1,
    "type": "goal",
    "title": "건강한 삶",
    "description": "전반적인 건강 관리",
    "parent_id": null,
    "is_milestone": false,
    "order": 1,
    "created_at": "2025-06-30T10:00:00Z",
    "updated_at": "2025-06-30T10:00:00Z",
    "deleted": false,
    "children_count": 2,
    "progress_percentage": 65.5
  }
}
```

#### 4. 목표 생성
```http
POST /api/v1/goals
```

**요청 본문:**
```json
{
  "title": "새로운 목표",
  "description": "목표 설명",
  "parent_id": null,
  "is_milestone": false,
  "order": 1
}
```

**응답:**
```json
{
  "success": true,
  "message": "목표가 성공적으로 생성되었습니다.",
  "data": {
    "id": 3,
    "type": "goal",
    "title": "새로운 목표",
    "description": "목표 설명",
    "parent_id": null,
    "is_milestone": false,
    "order": 1,
    "created_at": "2025-06-30T10:30:00Z",
    "updated_at": "2025-06-30T10:30:00Z",
    "deleted": false,
    "children_count": 0,
    "progress_percentage": 0.0
  }
}
```

#### 5. 목표 수정
```http
PUT /api/v1/goals/{goal_id}
```

**요청 본문:**
```json
{
  "title": "수정된 목표 제목",
  "description": "수정된 설명"
}
```

#### 6. 목표 삭제 (Soft Delete)
```http
DELETE /api/v1/goals/{goal_id}
```

**응답:**
```json
{
  "success": true,
  "message": "목표가 성공적으로 삭제되었습니다."
}
```

### Projects API

#### 1. 프로젝트 목록 조회
```http
GET /api/v1/projects
```

**쿼리 파라미터:**
- `page`: 페이지 번호
- `size`: 페이지 크기
- `parent_id`: 부모 목표 ID로 필터링
- `status`: 상태 필터링 (active, completed, overdue)
- `start_date`: 시작일 범위
- `end_date`: 종료일 범위

#### 2. 프로젝트 생성
```http
POST /api/v1/projects
```

**요청 본문:**
```json
{
  "title": "새로운 프로젝트",
  "description": "프로젝트 설명",
  "parent_id": 1,
  "parent_type": "goal",
  "start_date": "2025-07-01",
  "end_date": "2025-12-31",
  "is_milestone": false,
  "order": 1
}
```

### Tasks API

#### 1. 할일 목록 조회
```http
GET /api/v1/tasks
```

**쿼리 파라미터:**
- `page`: 페이지 번호
- `size`: 페이지 크기
- `parent_id`: 부모 노드 ID
- `parent_type`: 부모 타입
- `checked`: 완료 여부
- `is_milestone`: 마일스톤 여부
- `due_date`: 마감일 범위

#### 2. 할일 체크/체크 해제
```http
PATCH /api/v1/tasks/{task_id}/toggle
```

**응답:**
```json
{
  "success": true,
  "message": "할일 상태가 변경되었습니다.",
  "data": {
    "id": 1,
    "checked": true,
    "updated_at": "2025-06-30T11:00:00Z"
  }
}
```

### Routines API

#### 1. 루틴 목록 조회
```http
GET /api/v1/routines
```

**쿼리 파라미터:**
- `page`: 페이지 번호
- `size`: 페이지 크기
- `parent_id`: 부모 노드 ID
- `category`: 카테고리 필터링
- `frequency`: 빈도 필터링

#### 2. 루틴 수행 기록
```http
POST /api/v1/routines/{routine_id}/perform
```

**요청 본문:**
```json
{
  "date": "2025-06-30",
  "success": true,
  "note": "오늘 컨디션이 좋았다"
}
```

#### 3. 루틴 실패 기록
```http
POST /api/v1/routines/{routine_id}/fail
```

**요청 본문:**
```json
{
  "date": "2025-06-30",
  "reason": "너무 피곤해서 못 함",
  "mood": "무기력",
  "context": "전날 야근"
}
```

---

## 📊 분석 API

### 진행률 분석
```http
GET /api/v1/analytics/progress
```

**쿼리 파라미터:**
- `goal_id`: 특정 목표 ID
- `period`: 기간 (week, month, quarter, year)
- `start_date`: 시작일
- `end_date`: 종료일

**응답:**
```json
{
  "success": true,
  "message": "진행률 분석을 성공적으로 조회했습니다.",
  "data": {
    "overall_progress": 65.5,
    "goal_progress": [
      {
        "goal_id": 1,
        "title": "건강한 삶",
        "progress": 65.5,
        "completed_tasks": 15,
        "total_tasks": 23
      }
    ],
    "project_progress": [
      {
        "project_id": 2,
        "title": "12주 운동 챌린지",
        "progress": 45.0,
        "days_remaining": 83
      }
    ],
    "routine_performance": [
      {
        "routine_id": 1,
        "title": "매일 30분 운동",
        "completion_rate": 85.7,
        "streak_days": 5
      }
    ]
  }
}
```

### 루틴 분석
```http
GET /api/v1/analytics/routines
```

**응답:**
```json
{
  "success": true,
  "message": "루틴 분석을 성공적으로 조회했습니다.",
  "data": {
    "total_routines": 5,
    "active_routines": 4,
    "average_completion_rate": 78.5,
    "best_performing_routine": {
      "id": 1,
      "title": "매일 30분 운동",
      "completion_rate": 95.2
    },
    "category_performance": [
      {
        "category": "운동",
        "completion_rate": 85.0,
        "routine_count": 2
      }
    ]
  }
}
```

---

## 🔧 공통 기능

### 에러 처리
모든 API는 일관된 에러 응답 형식을 사용합니다:

```json
{
  "success": false,
  "message": "요청한 리소스를 찾을 수 없습니다.",
  "error_code": "NOT_FOUND",
  "details": {
    "resource": "goal",
    "id": 999
  }
}
```

### 페이지네이션
목록 조회 API는 모두 페이지네이션을 지원합니다:

```json
{
  "success": true,
  "message": "목록을 성공적으로 조회했습니다.",
  "data": [...],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### 검색 및 필터링
대부분의 목록 조회 API는 검색과 필터링을 지원합니다:

- `search`: 제목/설명 텍스트 검색
- `order_by`: 정렬 기준
- `order`: 정렬 방향 (asc/desc)
- 리소스별 특화 필터

---

## 🚀 구현 계획

### Phase 1: 기본 CRUD API
1. FastAPI 애플리케이션 구조 설정
2. Goal CRUD API 구현
3. Project CRUD API 구현
4. Task CRUD API 구현
5. Routine CRUD API 구현

### Phase 2: 고급 기능
1. 트리 구조 조회 API
2. 진행률 계산 API
3. 루틴 분석 API
4. 검색 및 필터링 강화

### Phase 3: 최적화
1. 캐싱 구현
2. 성능 최적화
3. 배치 처리
4. 실시간 업데이트

---

## 📝 참고사항

- 모든 날짜는 ISO 8601 형식 사용 (YYYY-MM-DD)
- 모든 시간은 UTC 기준
- ID는 정수형 사용
- Soft Delete 방식으로 데이터 보존
- 트랜잭션 처리로 데이터 일관성 보장

---

**다음 단계**: FastAPI 애플리케이션 구조 설정 및 Goal CRUD API 구현 