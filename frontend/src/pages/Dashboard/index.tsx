import React from 'react';
import { Card } from '../../components/common/Card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../services/tasks';
import { routinesApi } from '../../services/routines';
import { otherTasksApi } from '../../services/otherTasks';
import { projectsApi } from '../../services/projects';
import { milestoneGroupsApi } from '../../services/milestoneGroups';
import dayjs from 'dayjs';
import { 
  Target, 
  Calendar, 
  CheckCircle,
  Loader2,
  BarChart3,
  Zap
} from 'lucide-react';
import styled from 'styled-components';

// theme 타입 임시 선언 (App.tsx의 theme 구조와 동일하게)
type ThemeType = {
  colors: {
    primary: Record<number, string>;
    success: Record<number, string>;
    warning: Record<number, string>;
    danger: Record<number, string>;
    gray: Record<number, string>;
  };
  fontFamily: {
    sans: string;
  };
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 48px 0 48px;
  @media (max-width: 900px) {
    padding: 24px 12px 0 12px;
  }
`;
const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary[600]};
  color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(59,130,246,0.08);
  border: none;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(59,130,246,0.16);
    background: ${({ theme }) => theme.colors.primary[700]};
  }
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
const StatIconBox = styled.div<{ $bg: string }>`
  padding: 0.75rem;
  border-radius: 1rem;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;
const SectionSub = styled.span`
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
`;
const Badge = styled.span<{ $bg: string; $color: string }>`
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 0.75rem;
  display: inline-block;
`;
const TaskRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #f3f4f6;
  }
`;
const ActivityIconBox = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
  border-radius: 1rem;
  padding: 0.75rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const QuickActionBox = styled.div`
  text-align: center;
  padding: 2rem 0;
`;
const QuickActionBtn = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  background: ${({ $primary }) => ($primary ? '#2563eb' : '#f3f4f6')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#374151')};
  border: none;
  box-shadow: ${({ $primary }) => ($primary ? '0 2px 8px rgba(37,99,235,0.08)' : 'none')};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ $primary }) => ($primary ? '#1d4ed8' : '#e5e7eb')};
    color: ${({ $primary }) => ($primary ? '#fff' : '#111827')};
  }
`;
const GoalList = styled.div`
  margin-top: 2rem;
`;
const GoalItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  margin-bottom: 1rem;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  }
`;
const GoalIndex = styled.div<{ theme?: ThemeType }>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme?.colors.primary[500] ?? '#3b82f6'};
  color: #fff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 1rem;
  transition: transform 0.2s;
`;
const GoalInfo = styled.div`
  flex: 1;
`;
const GoalDate = styled.div`
  text-align: right;
  font-size: 0.85rem;
  color: #6b7280;
`;
const Dot = styled.div<{ theme?: ThemeType }>`
  width: 0.5rem;
  height: 0.5rem;
  background: ${({ theme }) => theme?.colors.primary[500] ?? '#3b82f6'};
  border-radius: 50%;
  margin-top: 0.25rem;
  margin-left: auto;
`;
const TaskList = styled.div``;
const TaskCheckbox = styled.input.attrs({ type: 'checkbox' })<{ theme?: ThemeType }>`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: ${({ theme }) => theme?.colors.primary[600] ?? '#2563eb'};
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  margin-right: 1rem;
`;
const TaskTitle = styled.p<{ $completed?: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ $completed }) => ($completed ? '#6b7280' : '#111827')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
`;
const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
  gap: 0.5rem;
`;
const ActivityList = styled.div``;
const ActivityRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 1rem;
  margin-bottom: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #f3f4f6;
  }
`;
const ActivityInfo = styled.div`
  flex: 1;
`;
const QuickActionBtnRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const Dashboard: React.FC = () => {
  // 날짜 상태
  const [selectedDate, setSelectedDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const today = dayjs().format('YYYY-MM-DD');
  const now = dayjs().format('HH:mm');

  // 데이터 fetch
  const { data: tasks = [], isLoading, error } = useQuery({ queryKey: ['tasks'], queryFn: tasksApi.getAll });
  const { data: routines = [], isLoading: routinesLoading, error: routinesError } = useQuery({ queryKey: ['routines'], queryFn: routinesApi.getAll });
  const { data: otherTasks = [], isLoading: otherTasksLoading, error: otherTasksError } = useQuery({ queryKey: ['otherTasks'], queryFn: otherTasksApi.getAll });
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({ queryKey: ['projects'], queryFn: projectsApi.getAll });
  const { data: milestoneGroups = [], isLoading: milestoneGroupsLoading, error: milestoneGroupsError } = useQuery({ queryKey: ['milestoneGroups'], queryFn: milestoneGroupsApi.getAll });
  const queryClient = useQueryClient();

  // 오늘/선택날짜에 해당하는 할일/루틴/기타할일 필터링
  const filteredTasks = tasks.filter(t => t.due_date === selectedDate && !t.deleted);
  const filteredRoutines = routines.filter(r => {
    // 구조화 반복빈도 정책에 따라 해당 날짜에 포함되는지 판별
    const d = dayjs(selectedDate);
    if (!r.frequency_type || r.frequency_type === 'everyday') return true;
    if (r.frequency_type === 'weekly' && Array.isArray(r.frequency_days)) {
      const daysEng = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const day = daysEng[d.day()];
      return r.frequency_days.includes(day);
    }
    if (r.frequency_type === 'count') return true; // 주X회는 매일 표시(정책 확장 가능)
    if (r.frequency_type === 'custom') return true;
    return false;
  });
  const filteredOtherTasks: any[] = []; // 기타할일 서비스 파일이 없으므로 임시 빈 배열

  // 할일 체크 핸들러(예시, 실제 API 연동 필요)
  const handleTaskCheck = async (taskId: string, checked: boolean) => {
    await tasksApi.update(taskId, { checked });
    // 쿼리 리프레시 필요
  };
  // 루틴 체크(수행) 핸들러(예시)
  const handleRoutineCheck = async (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    const performed = Array.isArray(routine?.performed_dates) && routine.performed_dates.some(d => d.date === selectedDate && d.success);
    if (performed) {
      await routinesApi.unperform(routineId, selectedDate);
    } else {
      await routinesApi.perform(routineId, selectedDate);
    }
    queryClient.invalidateQueries({ queryKey: ['routines'] });
  };

  // 오늘/선택날짜에 해당하는 프로젝트/마일스톤(진행중만)
  const filteredProjects = projects.filter(p => !p.deleted && (!p.end_date || p.end_date >= selectedDate));
  const filteredMilestoneGroups = milestoneGroups.filter(m => !m.deleted);

  // 로딩 상태
  if (isLoading || routinesLoading || projectsLoading || milestoneGroupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r rounded-full from-primary-500 to-primary-600">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">데이터를 불러오는 중</h3>
          <p className="text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || routinesError || projectsError || milestoneGroupsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center">
          <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">데이터를 불러오는데 실패했습니다</h3>
          <p className="mb-4 text-gray-500">백엔드 서버가 실행 중인지 확인해주세요.</p>
          <button className="btn btn-primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 통계 계산
  const stats = {
    totalGoals: 0, // goals 데이터가 없으므로 0으로 설정
    activeProjects: 0, // projects 데이터가 없으므로 0으로 설정
    todayTasks: filteredTasks.length + filteredRoutines.length,
    completedToday: filteredTasks.filter(t => t.checked).length,
    weeklyProgress: 0, // 주간 진행률 계산 로직 필요
    activeRoutines: filteredRoutines.length
  };

  const todayTasks = [
    { id: 1, title: '프로젝트 기획서 작성', type: 'task', completed: false, priority: 'high' },
    { id: 2, title: '운동하기', type: 'routine', completed: true, priority: 'medium' },
    { id: 3, title: '독서 30분', type: 'routine', completed: false, priority: 'low' },
    { id: 4, title: '팀 미팅 준비', type: 'task', completed: false, priority: 'high' },
  ];

  const recentActivities = [
    { id: 1, type: 'goal', title: '새로운 목표 생성', time: '2시간 전', icon: Target },
    { id: 2, type: 'routine', title: '운동 루틴 완료', time: '4시간 전', icon: CheckCircle },
    { id: 3, type: 'task', title: '보고서 제출 완료', time: '1일 전', icon: Calendar },
  ];

  return (
    <PageContainer>
      {/* 1. 맨 위: 현재 시간, 추천/격려 메시지 */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
        <div>
          <div style={{fontSize:32,fontWeight:700}}>{now}</div>
          <div style={{fontSize:18,color:'#2563eb',marginTop:4}}>오늘도 힘내세요! 할 수 있습니다 💪</div>
        </div>
        <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{fontSize:18,padding:8,borderRadius:8,border:'1px solid #ddd'}} />
      </div>
      {/* 2. 오늘의 할일/루틴/기타할일 리스트 */}
      <Card>
        <SectionTitle>{selectedDate === today ? '오늘의 할일' : `${selectedDate}의 할일`}</SectionTitle>
        <div style={{marginTop:16}}>
          {[...filteredTasks, ...filteredRoutines, ...filteredOtherTasks].length === 0 && <div>할일이 없습니다.</div>}
          {filteredTasks.map(task => (
            <TaskRow key={task.id}>
              <TaskCheckbox checked={task.checked} onChange={e=>handleTaskCheck(task.id, e.target.checked)} />
              <TaskTitle $completed={task.checked}>{task.title}</TaskTitle>
              <Badge $bg="#bbf7d0" $color="#15803d">할일</Badge>
            </TaskRow>
          ))}
          {filteredRoutines.map(routine => {
            // 오늘 수행했는지 판별
            const performed = Array.isArray(routine.performed_dates) && routine.performed_dates.some(d => d.date === selectedDate && d.success);
            return (
              <TaskRow key={routine.id}>
                <TaskCheckbox checked={performed} onChange={()=>handleRoutineCheck(routine.id)} />
                <TaskTitle $completed={performed}>{routine.title}</TaskTitle>
                <Badge $bg="#dbeafe" $color="#1d4ed8">루틴</Badge>
              </TaskRow>
            );
          })}
          {/* 기타할일 서비스 파일이 없으므로 기타할일 리스트는 임시로 비활성화 */}
        </div>
      </Card>
      {/* 3. 오늘/선택날짜에 해당하는 프로젝트/마일스톤(진행중) */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,marginTop:40}}>
        <Card>
          <SectionTitle>진행중인 프로젝트</SectionTitle>
          {filteredProjects.length === 0 && <div>진행중인 프로젝트가 없습니다.</div>}
          {filteredProjects.map(p => (
            <GoalItem key={p.id}>
              <GoalInfo>
                <div style={{fontWeight:600,fontSize:'1rem',color:'#111827',marginBottom:2}}>{p.title}</div>
                {p.description && <div style={{fontSize:'0.95rem',color:'#4b5563'}}>{p.description}</div>}
              </GoalInfo>
              <GoalDate>{p.start_date} ~ {p.end_date}</GoalDate>
            </GoalItem>
          ))}
        </Card>
        <Card>
          <SectionTitle>진행중인 마일스톤</SectionTitle>
          {filteredMilestoneGroups.length === 0 && <div>진행중인 마일스톤이 없습니다.</div>}
          {filteredMilestoneGroups.map(m => (
            <GoalItem key={m.id}>
              <GoalInfo>
                <div style={{fontWeight:600,fontSize:'1rem',color:'#111827',marginBottom:2}}>{m.title}</div>
                {m.description && <div style={{fontSize:'0.95rem',color:'#4b5563'}}>{m.description}</div>}
              </GoalInfo>
            </GoalItem>
          ))}
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <QuickActionBox>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: '#3b82f6', borderRadius: '9999px', marginBottom: 16 }}>
            <Zap style={{ width: 32, height: 32, color: '#fff' }} />
          </div>
          <SectionTitle style={{ marginBottom: 8 }}>빠른 시작</SectionTitle>
          <SectionSub style={{ marginBottom: 24, display: 'block' }}>새로운 목표나 프로젝트를 만들어보세요!</SectionSub>
          <QuickActionBtnRow>
            <QuickActionBtn $primary>
              <Target style={{ width: 16, height: 16, marginRight: 8 }} />
              목표 만들기
            </QuickActionBtn>
            <QuickActionBtn>
              <Calendar style={{ width: 16, height: 16, marginRight: 8 }} />
              프로젝트 시작
            </QuickActionBtn>
          </QuickActionBtnRow>
        </QuickActionBox>
      </Card>
    </PageContainer>
  );
}; 