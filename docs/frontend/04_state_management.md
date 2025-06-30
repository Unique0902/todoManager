# 상태관리 구조 설계

## 1. 전역 상태 구조 예시

### Auth Store (인증)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Tree Store (트리 구조)
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
  pinnedNodes: string[];
  filters: {
    hideRoutines: boolean;
    hideTasks: boolean;
  };
  isLoading: boolean;
  error: string | null;
}
```

### Routine Store (루틴)
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

### Emotion Store (감정일기)
```typescript
interface EmotionState {
  journals: EmotionJournal[];
  stats: EmotionStats;
  selectedDate: string;
  moodTags: string[];
  isLoading: boolean;
  error: string | null;
}
```

### Calendar Store (캘린더)
```typescript
interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
  viewMode: 'month' | 'week' | 'day';
  isLoading: boolean;
  error: string | null;
}
```

## 2. API 서비스 구조 예시
```typescript
class ApiService {
  private baseURL: string;
  private token: string | null;
  async get<T>(endpoint: string): Promise<T>;
  async post<T>(endpoint: string, data: any): Promise<T>;
  async put<T>(endpoint: string, data: any): Promise<T>;
  async delete<T>(endpoint: string): Promise<T>;
}
```

## 3. 커스텀 훅 예시
```typescript
export const useTree = () => {
  const [state, dispatch] = useReducer(treeReducer, initialState);
  // ...fetchGoals, createGoal, pinNode 등 액션 구현
  return {
    ...state,
    // 액션들
  };
};
``` 