# React 컴포넌트 구조도

## 1. 폴더/컴포넌트 구조
```
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── tree/
│   ├── dashboard/
│   ├── routine/
│   ├── emotion/
│   ├── calendar/
│   ├── analysis/
│   └── aspiration/
├── pages/
│   ├── Dashboard/
│   ├── TreeView/
│   ├── Routines/
│   ├── EmotionJournal/
│   ├── Calendar/
│   ├── Analysis/
│   ├── Aspiration/
│   ├── Settings/
│   └── Auth/
├── hooks/
├── services/
├── store/
├── utils/
├── types/
└── styles/
```

## 2. 주요 컴포넌트 예시
- **공통**: Button, Input, Modal, Loading, ErrorBoundary
- **레이아웃**: Header, Sidebar, Footer, Navigation
- **트리**: TreeNode, TreeView, TreeItem, TreeControls, TreeFilters
- **대시보드**: TodayTasks, RoutineCheck, EmotionPrompt, QuickActions, RecentActivity
- **루틴**: RoutineCard, RoutineForm, RoutineStats, RoutineCalendar, FailedLogForm, DifficultyAdjustment
- **감정일기**: EmotionForm, EmotionChart, EmotionHistory, EmotionCalendar, MoodTagSelector
- **캘린더**: CalendarView, CalendarEvent, DateSelector
- **분석**: ProgressChart, RoutineStats, EmotionHeatmap, ActivityTimeline
- **아이디어**: AspirationCard, AspirationForm, AspirationList

## 3. 컴포넌트 설계 원칙
- 재사용성, 관심사 분리, 상태 최소화, props 명확화, 스타일 일관성 