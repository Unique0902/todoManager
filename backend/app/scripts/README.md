# 📋 데이터베이스 관리 스크립트 사용법

이 문서는 todoManager 프로젝트의 데이터베이스 관리 스크립트들의 사용법을 설명합니다.

## 🚀 빠른 시작

### 환경 설정
```bash
# PYTHONPATH 설정 (Windows PowerShell)
$env:PYTHONPATH = "D:\projects\todoManager"

# 또는 환경변수로 설정
set PYTHONPATH=D:\projects\todoManager
```

### 통합 스크립트 사용 (추천)
```bash
# 도움말 보기
python backend/app/scripts/manage_data.py help

# 데이터만 삭제
python backend/app/scripts/manage_data.py clear

# 완전 초기화
python backend/app/scripts/manage_data.py reset

# 샘플 데이터 삽입
$env:PYTHONPATH = "D:\projects\todoManager"; python manage_data.py sample
```

---

## 📁 스크립트 목록

### 1. `manage_data.py` - 통합 관리 스크립트 (추천)
**가장 편리한 통합 스크립트입니다.**

#### 사용법
```bash
python backend/app/scripts/manage_data.py [명령어]
```

#### 명령어 목록
| 명령어 | 설명 | 사용 예시 |
|--------|------|-----------|
| `clear` | 모든 데이터 삭제 (테이블 구조 유지) | `python manage_data.py clear` |
| `reset` | 완전 초기화 (테이블 구조까지 삭제) | `python manage_data.py reset` |
| `sample` | 샘플 데이터 삽입 | `python manage_data.py sample` |
| `help` | 도움말 출력 | `python manage_data.py help` |

#### 특징
- ✅ 하나의 스크립트로 모든 작업 가능
- ✅ 명령행 인수로 간편한 사용
- ✅ 상세한 도움말 제공
- ✅ 이모지로 결과 확인 가능

---

### 2. `init_sample_data.py` - 샘플 데이터 삽입
**전체 모델을 아우르는 샘플 데이터를 삽입합니다.**

#### 사용법
```bash
python backend/app/scripts/init_sample_data.py
```

#### 생성되는 샘플 데이터
- **목표(Goal)**: "건강한 삶", "나만의 서비스 만들기"
- **프로젝트(Project)**: "12주 운동 챌린지", "할일 정리 앱 개발"
- **마일스톤그룹(MilestoneGroup)**: "주차별 목표", "개발 단계"
- **마일스톤/일반 Task**: 6개 (1주차 완료, 2주차 완료, 운동 계획 세우기, MVP UI 완성, 기본 기능 구현, 디자인 시안 확정)
- **기타할일(OtherTask)**: "병원 예약", "친구 생일 파티"
- **루틴(Routine)**: "매일 30분 운동", "매일 1시간 코딩"
- **아이디어/버킷리스트(Aspiration)**: "스카이다이빙 도전", "책 100권 읽기"
- **감정일기(EmotionJournal)**: 2개

---

### 3. `clear_data.py` - 데이터만 삭제
**테이블 구조는 유지하고 데이터만 삭제합니다.**

#### 사용법
```bash
python backend/app/scripts/clear_data.py
```

#### 특징
- ✅ 테이블 구조 유지
- ✅ 컬럼, 인덱스, 제약조건 유지
- ✅ 시퀀스(자동 증가 ID) 유지
- ❌ 데이터만 삭제
- ⚡ 빠르고 안전한 초기화

---

### 4. `reset_database.py` - 완전 초기화
**테이블 구조까지 모두 삭제하고 새로 생성합니다.**

#### 사용법
```bash
python backend/app/scripts/reset_database.py
```

#### 특징
- ✅ 테이블 구조 새로 생성
- ✅ 컬럼, 인덱스, 제약조건 새로 생성
- ✅ 시퀀스(자동 증가 ID) 리셋 (1부터 다시 시작)
- ❌ 데이터 삭제
- 🔄 완전히 깨끗한 상태

---

## 🔄 스크립트별 차이점 비교

| 기능 | `clear_data.py` | `reset_database.py` | `init_sample_data.py` | `manage_data.py` |
|------|----------------|-------------------|---------------------|------------------|
| 데이터 삭제 | ✅ | ✅ | ❌ | ✅ (clear/reset) |
| 테이블 삭제 | ❌ | ✅ | ❌ | ✅ (reset) |
| 테이블 생성 | ❌ | ✅ | ✅ | ✅ (reset/sample) |
| 샘플 데이터 삽입 | ❌ | ❌ | ✅ | ✅ (sample) |
| ID 시퀀스 리셋 | ❌ | ✅ | ❌ | ✅ (reset) |
| 사용 편의성 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 💡 사용 시나리오별 추천

### 🧪 개발 중 테스트
```bash
# 빠른 데이터 초기화
python manage_data.py clear
python manage_data.py sample
```

### 🔧 스키마 변경 후
```bash
# 새로운 구조 적용
python manage_data.py reset
python manage_data.py sample
```

### 🆔 ID 시퀀스 리셋 필요
```bash
# 깨끗한 상태로 시작
python manage_data.py reset
```

### 🚀 프로덕션 환경
```bash
# 안전한 데이터 초기화
python manage_data.py clear
```

---

## ⚠️ 주의사항

### 1. **데이터 백업**
- 중요한 데이터가 있다면 실행 전 백업을 권장합니다.
- `reset` 명령어는 **모든 데이터를 영구 삭제**합니다.

### 2. **환경 설정**
- `.env` 파일의 `DATABASE_URL`이 올바른지 확인하세요.
- `PYTHONPATH` 설정이 필요합니다.

### 3. **외래키 제약조건**
- `clear_data.py`는 외래키 제약조건을 고려하여 삭제 순서를 조정합니다.
- 자식 테이블부터 삭제하여 오류를 방지합니다.

---

## 🛠️ 문제 해결

### 1. **ModuleNotFoundError: No module named 'backend'**
```bash
# PYTHONPATH 설정 확인
echo $env:PYTHONPATH
# 또는
set PYTHONPATH
```

### 2. **DATABASE_URL이 None**
```bash
# .env 파일 확인
python test_env.py
```

### 3. **외래키 제약조건 오류**
- `clear_data.py` 사용을 권장합니다.
- 삭제 순서가 자동으로 조정됩니다.

---

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. `.env` 파일의 `DATABASE_URL` 설정
2. `PYTHONPATH` 환경변수 설정
3. PostgreSQL 서버 연결 상태
4. 데이터베이스 권한 설정

---

**마지막 업데이트**: 2025-06-30 