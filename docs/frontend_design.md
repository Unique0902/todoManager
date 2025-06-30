# 🎨 todoManager 프론트엔드 설계

## 📋 목차
1. [전체 UI/UX 플로우 설계](#1-전체-uiux-플로우-설계)
2. [React 컴포넌트 구조도](#2-react-컴포넌트-구조도)
3. [주요 페이지 설계](#3-주요-페이지-설계)
4. [상태관리 구조 설계](#4-상태관리-구조-설계)
5. [기술 스택 및 라이브러리](#5-기술-스택-및-라이브러리)
6. [개발 우선순위](#6-개발-우선순위)

---

## 1. 전체 UI/UX 플로우 설계

### 🏠 메인 플로우
```
로그인/회원가입 → 홈 대시보드 → 트리뷰/루틴/감정일기/캘린더/분석/아이디어 선택
```

### 📱 주요 사용자 여정 (User Journey)

#### 1) 목표 관리 플로우
```
홈 대시보드 → 트리뷰 → 목표 생성 → 프로젝트 추가 → 할일 생성 → 진행률 확인
```

#### 2) 루틴 관리 플로우
```
홈 대시보드 → 루틴 페이지 → 루틴 생성 → 일일 수행 기록 → 실패 기록 → 통계 확인
```

#### 3) 감정일기 플로우
```
홈 대시보드 → 감정일기 페이지 → 일일 감정 기록 → 히스토리 조회 → 통계 분석
```

### 🎯 UI/UX 원칙
- **직관성**: 트리 구조를 시각적으로 명확하게 표현
- **일관성**: 모든 페이지에서 동일한 디자인 시스템 적용
- **반응성**: 모바일/태블릿/데스크톱 모든 디바이스 지원
- **접근성**: 색맹/시각장애인을 고려한 디자인

### 🔄 데이터 흐름 및 상호작용
- **루틴**: 트리에도 포함되지만, 홈 대시보드/분석/루틴전용 뷰에서도 동시에 다뤄짐
- **겹치는 데이터 표현**: 각 뷰에서 동일한 루틴 데이터를 다른 관점으로 표시
- **상호작용 정리**: 루틴 수정 시 모든 관련 뷰에서 동기화 필요
- **데이터 일관성**: 트리뷰에서의 변경사항이 다른 뷰에 즉시 반영되도록 설계

---

## 2. React 컴포넌트 구조도

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Loading/
│   │   └── ErrorBoundary/
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── Navigation/
│   ├── tree/            # 트리 구조 관련
│   │   ├── TreeNode/
│   │   ├── TreeView/
│   │   ├── TreeItem/
│   │   ├── TreeControls/
│   │   └── TreeFilters/
│   ├── dashboard/       # 홈 대시보드 관련
│   │   ├── TodayTasks/
│   │   ├── RoutineCheck/
│   │   ├── EmotionPrompt/
│   │   ├── QuickActions/
│   │   └── RecentActivity/
│   ├── routine/         # 루틴 관련
│   │   ├── RoutineCard/
│   │   ├── RoutineForm/
│   │   ├── RoutineStats/
│   │   ├── RoutineCalendar/
│   │   ├── FailedLogForm/
│   │   └── DifficultyAdjustment/
│   ├── emotion/         # 감정일기 관련
│   │   ├── EmotionForm/
│   │   ├── EmotionChart/
│   │   ├── EmotionHistory/
│   │   ├── EmotionCalendar/
│   │   └── MoodTagSelector/
│   ├── calendar/        # 캘린더 관련
│   │   ├── CalendarView/
│   │   ├── CalendarEvent/
│   │   └── DateSelector/
│   ├── analysis/        # 분석 관련
│   │   ├── ProgressChart/
│   │   ├── RoutineStats/
│   │   ├── EmotionHeatmap/
│   │   └── ActivityTimeline/
│   └── aspiration/      # 아이디어/버킷리스트 관련
│       ├── AspirationCard/
│       ├── AspirationForm/
│       └── AspirationList/
├── pages/               # 페이지 컴포넌트
│   ├── Dashboard/       # 홈 대시보드
│   ├── TreeView/        # 트리뷰
│   ├── Routines/        # 루틴 전용 뷰
│   ├── EmotionJournal/  # 감정일기
│   ├── Calendar/        # 캘린더 뷰
│   ├── Analysis/        # 분석 탭
│   ├── Aspiration/      # 아이디어/버킷리스트
│   ├── Settings/
│   └── Auth/
├── hooks/               # 커스텀 훅
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── useTree.ts
│   ├── useRoutine.ts
│   ├── useEmotion.ts
│   └── useCalendar.ts
├── services/            # API 서비스
│   ├── api.ts
│   ├── auth.ts
│   ├── goals.ts
│   ├── routines.ts
│   ├── emotions.ts
│   └── aspirations.ts
├── store/               # 상태 관리
│   ├── auth/
│   ├── tree/
│   ├── routine/
│   ├── emotion/
│   └── calendar/
├── utils/               # 유틸리티 함수
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   └── treeUtils.ts
├── types/               # TypeScript 타입 정의
│   ├── api.ts
│   ├── components.ts
│   ├── tree.ts
│   └── common.ts
└── styles/              # 스타일 파일
    ├── globals.css
    ├── variables.css
    └── components/
```

---

## 3. 주요 페이지 설계

### 🏠 홈 대시보드 (Dashboard)
**목적**: 오늘의 할일, 루틴 체크, 감정일기 작성 유도

#### 주요 컴포넌트
- **TodayTasks**: 오늘의 할일 목록 (task, other_task 구분)
- **RoutineCheck**: 오늘의 루틴 체크 및 수행 기록
- **EmotionPrompt**: 감정일기 작성 유도
- **QuickActions**: 빠른 액션 버튼들
- **RecentActivity**: 최근 활동 내역

#### 레이아웃
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ TodayTasks | RoutineCheck           │
├─────────────────────────────────────┤
│ EmotionPrompt | QuickActions        │
├─────────────────────────────────────┤
│ RecentActivity                      │
└─────────────────────────────────────┘
```

### 🌳 트리뷰 (TreeView)
**목적**: 목표-프로젝트-할일의 계층 구조를 시각적으로 표현

#### 주요 컴포넌트
- **TreeControls**: 확장/축소, 필터링, 정렬, 노드 고정
- **TreeNode**: 개별 노드 (목표/프로젝트/할일/루틴)
- **TreeItem**: 노드 내부 콘텐츠
- **TreeActions**: 노드별 액션 (수정/삭제/추가)
- **TreeSearch**: 검색 기능
- **TreeFilters**: 루틴/할일 숨기기 기능

#### 트리뷰 정책
- 피그마 스타일 드래그/확대/축소/이동
- 자식 노드 추가만 가능, 수정/삭제는 상세페이지에서
- 각 노드 클릭 시 상세페이지 이동
- **필터**: 루틴/할일 숨기기 기능(복잡한 트리 시 가독성 향상)
- **노드 고정**: 사용자가 원하는 goal, project 노드를 수동 고정

#### 레이아웃
```
┌─────────────────────────────────────┐
│ TreeControls                        │
├─────────────────────────────────────┤
│ TreeSearch | TreeFilters            │
├─────────────────────────────────────┤
│ TreeView                            │
│ ├── 🎯 목표: 개발자 되기            │
│ │   ├── 📁 프로젝트: 포트폴리오     │
│ │   │   ├── ✅ 할일: React 학습     │
│ │   │   └── ✅ 할일: 컴포넌트 설계  │
│ │   └── 📁 프로젝트: 알고리즘 공부  │
│ └── 🎯 목표: 건강 관리              │
└─────────────────────────────────────┘
```

### 📊 루틴 전용 뷰 (Routines)
**목적**: 루틴 목록, 수행률, 난이도 조정, 실패 기록 관리

#### 주요 컴포넌트
- **RoutineList**: 루틴 목록
- **RoutineCard**: 개별 루틴 카드
- **RoutineForm**: 루틴 생성/수정 폼
- **RoutineStats**: 수행률 통계
- **RoutineCalendar**: 캘린더 뷰
- **RoutineActions**: 수행/실패 기록
- **FailedLogForm**: 실패 기록 폼
- **DifficultyAdjustment**: 난이도 조정

#### 루틴 정책
- **루틴은 수행률 계산** (주간/월간)
- **performed_dates**: 성공한 수행 기록만 저장
- **failed_logs**: 실패한 경우만 저장
- **중복 방지**: 같은 날짜가 두 곳에 중복으로 기록되지 않도록 규칙 적용
- **routine의 failed_logs는 하루 1개만 기록 가능**

#### 레이아웃
```
┌─────────────────────────────────────┐
│ RoutineStats                        │
├─────────────────────────────────────┤
│ RoutineList | RoutineCalendar       │
├─────────────────────────────────────┤
│ RoutineForm                         │
└─────────────────────────────────────┘
```

### 📝 감정일기 (EmotionJournal)
**목적**: 일일 감정 기록 및 분석

#### 주요 컴포넌트
- **EmotionForm**: 감정 기록 폼
- **EmotionChart**: 감정 변화 차트
- **EmotionHistory**: 과거 기록
- **EmotionCalendar**: 감정 히트맵
- **EmotionStats**: 감정 통계
- **MoodTagSelector**: 감정 태그 선택기

#### 감정일기 정책
- **하루 여러 개 작성 가능**, 날짜 기준
- **routine과 직접 연동은 없음** (추후 linked_routine_id 확장 가능)
- 홈페이지 "오늘 하루 피드백"에서 감정일기 작성 유도
- **MVP에서는 emotion_journal ↔ routine.failed_logs 간 연동 없음**
- **mood_tag는 TEXT** (ENUM 아님), 사용자 정의 허용

#### 레이아웃
```
┌─────────────────────────────────────┐
│ EmotionForm                         │
├─────────────────────────────────────┤
│ EmotionChart | EmotionStats         │
├─────────────────────────────────────┤
│ EmotionHistory | EmotionCalendar    │
└─────────────────────────────────────┘
```

### 📅 캘린더 뷰 (Calendar)
**목적**: 일정 관리, 날짜별 할일/루틴 표시

#### 주요 컴포넌트
- **CalendarView**: 메인 캘린더 컴포넌트
- **CalendarEvent**: 일정 표시
- **DateSelector**: 날짜 선택기

#### 캘린더 정책
- **task와 other_task 구분 표시**
- **task**: 체크 가능한 할일
- **other_task**: 체크 불가능한 일정, 캘린더와 홈에서만 표시

### 📈 분석 탭 (Analysis)
**목적**: 통계, 그래프, 히트맵 등 데이터 시각화

#### 주요 컴포넌트
- **ProgressChart**: 진행률 차트
- **RoutineStats**: 루틴 통계
- **EmotionHeatmap**: 감정 히트맵
- **ActivityTimeline**: 활동 타임라인

#### 분석 정책
- **진행률은 goal/project만 표시, routine 포함 시 제외**
- **분석 탭의 통계 그래프에서도 동일하게 적용**: project의 완료율 분석 그래프에서 routine의 수행률은 포함되지 않음

### 💡 아이디어/버킷리스트 (Aspiration)
**목적**: 하고 싶은 일, 아이디어, 도전하고 싶은 것 등 별도 페이지에서 관리

#### 주요 컴포넌트
- **AspirationCard**: 아이디어 카드
- **AspirationForm**: 아이디어 생성/수정 폼
- **AspirationList**: 아이디어 목록

#### 아이디어 정책
- 트리와 직접 연결되지 않음
- 중요도, 카테고리, 작성일, linked_goal_id(추후 목표/프로젝트 전환 대비) 등 필드

---

## 4. 상태관리 구조 설계

### 🔄 전역 상태 구조

#### Auth Store (인증)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

#### Tree Store (트리 구조)
```typescript
interface TreeState {
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  otherTasks: OtherTask[];
  routines: Routine[];
  ideas: Idea[];
  selectedNode: TreeNode | null;
  expandedNodes: string[];
  pinnedNodes: string[]; // 고정된 노드들
  filters: {
    hideRoutines: boolean;
    hideTasks: boolean;
  };
  isLoading: boolean;
  error: string | null;
}
```

#### Routine Store (루틴)
```typescript
interface RoutineState {
  routines: Routine[];
  performances: RoutinePerformance[];
  failedLogs: FailedLog[];
  stats: RoutineStats;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}
```

#### Emotion Store (감정일기)
```typescript
interface EmotionState {
  journals: EmotionJournal[];
  stats: EmotionStats;
  selectedDate: string;
  moodTags: string[]; // 사용자 정의 감정 태그들
  isLoading: boolean;
  error: string | null;
}
```

#### Calendar Store (캘린더)
```typescript
interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
  viewMode: 'month' | 'week' | 'day';
  isLoading: boolean;
  error: string | null;
}
```

### 📡 API 통신 구조

#### API Service Layer
```typescript
// services/api.ts
class ApiService {
  private baseURL: string;
  private token: string | null;

  // CRUD 메서드들
  async get<T>(endpoint: string): Promise<T>;
  async post<T>(endpoint: string, data: any): Promise<T>;
  async put<T>(endpoint: string, data: any): Promise<T>;
  async delete<T>(endpoint: string): Promise<T>;
}

// 서비스별 API 클래스
class GoalsApi extends ApiService {
  async getGoals(): Promise<Goal[]>;
  async createGoal(goal: CreateGoalDto): Promise<Goal>;
  async updateGoal(id: number, goal: UpdateGoalDto): Promise<Goal>;
  async deleteGoal(id: number): Promise<void>;
  async getTree(id: number): Promise<TreeNode>;
}

class RoutinesApi extends ApiService {
  async getRoutines(): Promise<Routine[]>;
  async createRoutine(routine: CreateRoutineDto): Promise<Routine>;
  async performRoutine(id: number, date: string): Promise<void>;
  async logFailure(id: number, failedLog: FailedLogDto): Promise<void>;
  async adjustDifficulty(id: number, adjustment: DifficultyAdjustmentDto): Promise<void>;
}
```

#### Custom Hooks
```typescript
// hooks/useTree.ts
export const useTree = () => {
  const [state, dispatch] = useReducer(treeReducer, initialState);
  
  const fetchGoals = useCallback(async () => {
    // API 호출 및 상태 업데이트
  }, []);
  
  const createGoal = useCallback(async (goal: CreateGoalDto) => {
    // 목표 생성 로직
  }, []);
  
  const pinNode = useCallback((nodeId: string) => {
    // 노드 고정 로직
  }, []);
  
  return {
    ...state,
    fetchGoals,
    createGoal,
    pinNode,
    // 기타 액션들
  };
};
```

---

## 5. 기술 스택 및 라이브러리

### 🛠️ 핵심 기술
- **React 18** - 사용자 인터페이스 라이브러리 (최신 Concurrent Features 활용)
- **TypeScript 5.x** - 타입 안전성 및 최신 타입 기능
- **Vite 5.x** - 빠른 빌드 도구 및 개발 서버 (Webpack 대안)

### 📦 주요 라이브러리

#### 상태 관리
- **Zustand 4.x** - 경량 상태 관리 (Redux 대안, 최신 React 패턴 지원)
- **TanStack Query 5.x** - 서버 상태 관리 (React Query에서 이름 변경)

#### UI/스타일링
- **Tailwind CSS 3.x** - 유틸리티 기반 CSS 프레임워크
- **Radix UI** - 접근성 고려한 Headless UI 컴포넌트 (Headless UI 대안)
- **Lucide React** - 현대적인 아이콘 라이브러리 (React Icons 대안)
- **Framer Motion** - 애니메이션 라이브러리 (트리뷰 인터랙션용)

#### 폼 관리
- **React Hook Form 7.x** - 폼 상태 관리
- **Zod 3.x** - 스키마 검증 (TypeScript와 완벽 통합)

#### 차트/시각화
- **Recharts 2.x** - React 차트 라이브러리
- **React Big Calendar** - 풍부한 캘린더 컴포넌트
- **D3.js** - 고급 시각화 (필요시)

#### 라우팅
- **React Router 6.x** - 클라이언트 사이드 라우팅

#### HTTP 클라이언트
- **Axios 1.x** - HTTP 요청 라이브러리
- **SWR** - 데이터 페칭 (TanStack Query 대안)

#### 개발 도구
- **ESLint 8.x** - 코드 린팅
- **Prettier 3.x** - 코드 포맷팅
- **Husky 8.x** - Git 훅
- **lint-staged** - 스테이징된 파일만 린트
- **Vitest** - Vite 기반 테스트 러너 (Jest 대안)

#### 추가 고려사항
- **React 19** - 출시 시 마이그레이션 고려
- **Bun** - 빠른 패키지 매니저 (npm/yarn 대안)
- **Pnpm** - 디스크 공간 효율적인 패키지 매니저

---

## 6. 개발 우선순위

### 🎯 Phase 1: 기본 구조 (1주)
- [ ] React + TypeScript 프로젝트 설정
- [ ] 기본 라우팅 구조
- [ ] 공통 컴포넌트 (Button, Input, Modal)
- [ ] 레이아웃 컴포넌트 (Header, Sidebar)

### 🎯 Phase 2: 홈 대시보드 (1주)
- [ ] TodayTasks 컴포넌트
- [ ] RoutineCheck 컴포넌트
- [ ] EmotionPrompt 컴포넌트
- [ ] QuickActions 컴포넌트

### 🎯 Phase 3: 트리뷰 (2주)
- [ ] TreeNode 컴포넌트
- [ ] TreeView 컴포넌트
- [ ] 트리 확장/축소 기능
- [ ] 노드 고정 기능
- [ ] 필터링 기능

### 🎯 Phase 4: 루틴 관리 (2주)
- [ ] 루틴 목록/카드
- [ ] 루틴 생성/수정 폼
- [ ] 수행 기록 기능
- [ ] 실패 기록 기능
- [ ] 난이도 조정 기능

### 🎯 Phase 5: 감정일기 (2주)
- [ ] 감정 기록 폼
- [ ] 감정 차트
- [ ] 감정 히스토리
- [ ] 감정 캘린더
- [ ] 사용자 정의 감정 태그

### 🎯 Phase 6: 캘린더/분석/아이디어 (2주)
- [ ] 캘린더 뷰
- [ ] 분석 탭
- [ ] 아이디어/버킷리스트
- [ ] 통합 및 최적화

---

## 📝 다음 단계

1. **React 프로젝트 초기 설정**
2. **기본 컴포넌트 구조 생성**
3. **API 연동 구조 설계**
4. **상태 관리 설정**

> 이 설계는 기존 시스템 계획 문서의 정책을 반영하여 작성되었으며, 개발 진행에 따라 지속적으로 업데이트됩니다. 