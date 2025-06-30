# 주요 페이지 설계

## 1. 홈 대시보드 (Dashboard)
- **목적**: 오늘의 할일, 루틴 체크, 감정일기 작성 유도
- **주요 컴포넌트**: TodayTasks, RoutineCheck, EmotionPrompt, QuickActions, RecentActivity
- **레이아웃**:
```
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ TodayTasks | RoutineCheck    │
├──────────────────────────────┤
│ EmotionPrompt | QuickActions │
├──────────────────────────────┤
│ RecentActivity               │
└──────────────────────────────┘
```

## 2. 트리뷰 (TreeView)
- **목적**: 목표-프로젝트-할일의 계층 구조 시각화
- **주요 컴포넌트**: TreeControls, TreeNode, TreeItem, TreeActions, TreeSearch, TreeFilters
- **정책**: 드래그/확대/축소/이동, 자식 노드 추가만 가능, 노드 고정, 필터링 등

## 3. 루틴 전용 뷰 (Routines)
- **목적**: 루틴 목록, 수행률, 난이도 조정, 실패 기록 관리
- **주요 컴포넌트**: RoutineList, RoutineCard, RoutineForm, RoutineStats, RoutineCalendar, FailedLogForm, DifficultyAdjustment
- **정책**: 수행률 계산, 실패 기록, 중복 방지, 하루 1개 실패 기록 등

## 4. 감정일기 (EmotionJournal)
- **목적**: 일일 감정 기록 및 분석
- **주요 컴포넌트**: EmotionForm, EmotionChart, EmotionHistory, EmotionCalendar, EmotionStats, MoodTagSelector
- **정책**: 하루 여러 개 작성, routine과 직접 연동 없음, 사용자 정의 감정 태그 등

## 5. 캘린더/분석/아이디어
- **캘린더**: CalendarView, CalendarEvent, DateSelector (task/other_task 구분)
- **분석**: ProgressChart, RoutineStats, EmotionHeatmap, ActivityTimeline (진행률 정책 반영)
- **아이디어**: AspirationCard, AspirationForm, AspirationList (트리와 직접 연결X) 