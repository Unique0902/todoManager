// 기본 노드 타입
export type NodeType = 
  | 'goal' 
  | 'project' 
  | 'task' 
  | 'other_task' 
  | 'routine' 
  | 'milestone_group' 
  | 'aspiration' 
  | 'emotion_journal';

// 기본 노드 인터페이스
export interface BaseNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  parent_id?: string;
  parent_type?: NodeType;
  order?: number;
  created_at: string;
  updated_at: string;
  deleted?: boolean;
}

// 목표 노드
export interface Goal extends BaseNode {
  type: 'goal';
  is_milestone?: boolean;
  milestone_date?: string;
}

// 프로젝트 노드
export interface Project extends BaseNode {
  type: 'project';
  start_date: string;
  end_date: string;
  is_milestone?: boolean;
  milestone_date?: string;
}

// 태스크 노드
export interface Task extends BaseNode {
  type: 'task';
  due_date?: string;
  checked?: boolean;
  is_milestone?: boolean;
  milestone_date?: string;
  order_index?: number;
}

// 기타 할일 노드
export interface OtherTask extends BaseNode {
  type: 'other_task';
  due_date?: string;
}

// 루틴 노드
export interface Routine extends BaseNode {
  type: 'routine';
  start_date: string;
  frequency: string;
  category?: string;
  performed_count: number;
  performed_dates: Array<{ date: string; success: boolean }>;
  failed_logs: Array<{
    date: string;
    reason: string;
    mood?: string;
    context?: string;
  }>;
  difficulty_history: Array<{
    change_type: string;
    reason: string;
    before_description: string;
    after_description: string;
    date: string;
  }>;
  history_log: Array<{
    change_type: string;
    details: string;
    date: string;
  }>;
  // 구조화 반복빈도 필드 추가
  frequency_type?: string;
  frequency_days?: string[];
  frequency_count?: number;
  frequency_custom?: string;
}

// 마일스톤 그룹 노드
export interface MilestoneGroup extends BaseNode {
  type: 'milestone_group';
  is_milestone?: boolean;
  milestone_date?: string;
}

// 아이디어/버킷리스트 노드
export interface Aspiration extends BaseNode {
  type: 'aspiration';
  category?: string;
  importance?: number;
  linked_goal_id?: string;
}

// 감정일기 노드
export interface EmotionJournal extends BaseNode {
  type: 'emotion_journal';
  date: string;
  content: string;
  mood_tag?: string;
  linked_routine_id?: string;
}

// 트리 노드 (계층 구조)
export interface TreeNode extends BaseNode {
  children: TreeNode[];
  progress?: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// 인증 타입
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 루틴 성과 추적 타입
export interface RoutinePerformance {
  routine_id: string;
  date: string;
  success: boolean;
  reason?: string;
  mood?: string;
  context?: string;
}

// 통계 타입
export interface Statistics {
  total_goals: number;
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  total_routines: number;
  active_routines: number;
  weekly_progress: number;
  monthly_progress: number;
}

// 필터 타입
export interface FilterOptions {
  type?: NodeType[];
  status?: 'all' | 'active' | 'completed';
  date_range?: {
    start: string;
    end: string;
  };
  category?: string[];
  search?: string;
}

// 정렬 타입
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
} 