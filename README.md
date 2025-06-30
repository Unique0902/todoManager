# 📋 todoManager

목표, 프로젝트, 마일스톤, 루틴, 할일 등을 트리 구조로 관리하는 자기관리/생산성 시스템

## 🚀 프로젝트 개요

todoManager는 개인의 목표와 프로젝트를 체계적으로 관리할 수 있는 웹 애플리케이션입니다. 트리 구조를 통해 목표 → 프로젝트 → 할일의 계층적 관계를 시각화하고, 루틴 성과 추적, 감정일기 등 다양한 자기관리 기능을 제공합니다.

### ✨ 주요 기능

- **🎯 목표 관리**: 장기/단기 목표 설정 및 추적
- **📁 프로젝트 관리**: 목표별 프로젝트 구성
- **✅ 할일 관리**: 태스크, 루틴, 기타 할일 분류 관리
- **🌳 트리 구조**: 계층적 관계 시각화
- **📊 루틴 성과 추적**: 일일 루틴 수행 이력 및 통계
- **📝 감정일기**: 감정 점수 및 일기 기록
- **💡 아이디어 관리**: 포부 및 아이디어 저장

## 🏗️ 기술 스택

### Backend
- **FastAPI** - 현대적이고 빠른 웹 프레임워크
- **SQLModel** - SQLAlchemy + Pydantic 통합 ORM
- **PostgreSQL** - 관계형 데이터베이스
- **Alembic** - 데이터베이스 마이그레이션
- **Pytest** - 테스트 프레임워크

### Frontend (예정)
- **React** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성
- **Axios** - HTTP 클라이언트
- **React Query** - 서버 상태 관리

## 📁 프로젝트 구조

```
todoManager/
├── backend/                 # 백엔드 애플리케이션
│   ├── app/
│   │   ├── models/         # 데이터 모델
│   │   ├── routers/        # API 라우터
│   │   ├── database.py     # 데이터베이스 설정
│   │   └── main.py         # FastAPI 앱
│   ├── tests/              # 테스트 코드
│   ├── alembic/            # 마이그레이션
│   └── requirements.txt    # Python 의존성
├── frontend/               # 프론트엔드 (예정)
├── docs/                   # 문서
└── README.md
```

## 🚀 빠른 시작

### 1. 환경 설정

#### 필수 요구사항
- Python 3.9+
- PostgreSQL 12+
- Node.js 16+ (프론트엔드용)

#### 환경변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 데이터베이스 설정
DATABASE_URL=postgresql://username:password@localhost:5432/todomanager
```

### 2. 백엔드 실행

```bash
# 의존성 설치
cd backend
pip install -r requirements.txt

# 데이터베이스 마이그레이션
alembic upgrade head

# 샘플 데이터 삽입 (선택사항)
$env:PYTHONPATH = "D:\projects\todoManager"; python scripts/init_sample_data.py

# 서버 실행
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. API 문서 확인
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 API 명세

### 주요 엔드포인트

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/v1/goals` | 목표 목록 조회 |
| `POST /api/v1/goals` | 목표 생성 |
| `GET /api/v1/goals/{id}/tree` | 트리 구조 조회 |
| `GET /api/v1/projects` | 프로젝트 목록 조회 |
| `GET /api/v1/tasks` | 할일 목록 조회 |
| `GET /api/v1/routines` | 루틴 목록 조회 |
| `POST /api/v1/routines/{id}/perform` | 루틴 수행 기록 |
| `GET /api/v1/emotion-journals` | 감정일기 목록 조회 |

### 데이터 모델

#### Goal (목표)
```json
{
  "id": 1,
  "type": "goal",
  "title": "개발자 되기",
  "description": "웹 개발자로 취업하기",
  "parent_id": null,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Project (프로젝트)
```json
{
  "id": 1,
  "type": "project",
  "title": "포트폴리오 웹사이트",
  "description": "React로 포트폴리오 사이트 만들기",
  "parent_id": 1,
  "parent_type": "goal",
  "status": "in_progress"
}
```

## 🧪 테스트

### 테스트 실행
```bash
# 전체 테스트
$env:PYTHONPATH = "D:\projects\todoManager"; pytest backend/tests -v

# 특정 테스트 파일
$env:PYTHONPATH = "D:\projects\todoManager"; pytest backend/tests/test_goals.py -v

# 특정 테스트 함수
$env:PYTHONPATH = "D:\projects\todoManager"; pytest backend/tests/test_goals.py::test_goal_crud -v
```

### 테스트 커버리지
- **총 17개 테스트** ✅
- **모든 주요 API 엔드포인트** 포함
- **CRUD, 유효성 검사, 예외 처리** 테스트 완료

## 🛠️ 개발 도구

### 데이터베이스 관리
```bash
# 마이그레이션 생성
alembic revision --autogenerate -m "설명"

# 마이그레이션 적용
alembic upgrade head

# 마이그레이션 롤백
alembic downgrade -1
```

### 샘플 데이터 관리
```bash
# 샘플 데이터 삽입
$env:PYTHONPATH = "D:\projects\todoManager"; python scripts/init_sample_data.py

# 데이터 초기화
$env:PYTHONPATH = "D:\projects\todoManager"; python scripts/reset_database.py

# 데이터 삭제
$env:PYTHONPATH = "D:\projects\todoManager"; python scripts/clear_data.py
```

## 📊 트리 구조 예시

```
🎯 목표: 개발자 되기
├── 📁 프로젝트: 포트폴리오 웹사이트
│   ├── ✅ 할일: React 학습
│   ├── ✅ 할일: 컴포넌트 설계
│   └── 📊 루틴: 매일 코딩 연습
├── 📁 프로젝트: 알고리즘 공부
│   ├── ✅ 할일: 백준 문제 풀이
│   └── 📊 루틴: 하루 3문제 풀기
└── 💡 아이디어: 블로그 시작하기
```

## 🔧 설정 및 환경변수

### 데이터베이스 설정
```python
# backend/app/database.py
DATABASE_URL = "postgresql://username:password@localhost:5432/todomanager"
```

### CORS 설정
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚧 개발 로드맵

### Phase 1: 백엔드 완료 ✅
- [x] 데이터베이스 설계
- [x] API 엔드포인트 구현
- [x] 테스트 코드 작성
- [x] 예외 처리 및 유효성 검사

### Phase 2: 프론트엔드 개발 (진행 예정)
- [ ] React 프로젝트 설정
- [ ] 기본 UI 컴포넌트
- [ ] API 연동
- [ ] 트리 구조 UI
- [ ] 대시보드

### Phase 3: 고급 기능
- [ ] 통계 및 분석
- [ ] 데이터 내보내기/가져오기
- [ ] 알림 기능
- [ ] 사용자 인증

### Phase 4: 배포
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인
- [ ] 클라우드 배포

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**Made with ❤️ for better productivity** 