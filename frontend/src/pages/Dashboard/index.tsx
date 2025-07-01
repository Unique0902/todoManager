import React from 'react';
import { Card } from '../../components/common/Card';
import { useGoals } from '../../hooks/useGoals';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Loader2,
  ArrowUpRight,
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
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
`;
const SubTitle = styled.p`
  color: #4b5563;
  font-size: 1.125rem;
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
  // 실제 API 데이터 사용
  const { data: goals, isLoading, error } = useGoals();

  // 로딩 상태
  if (isLoading) {
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
  if (error) {
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
    totalGoals: goals?.length || 0,
    activeProjects: goals?.filter(g => g.type === 'project').length || 0,
    todayTasks: 8,
    completedToday: 3,
    weeklyProgress: 75,
    activeRoutines: 4
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
      {/* 페이지 헤더 */}
      <Header>
        <div>
          <Title>오늘의 대시보드</Title>
          <SubTitle>
            {goals && goals.length > 0 
              ? `${goals.length}개의 목표로 더 나은 하루를 만들어보세요!` 
              : '첫 번째 목표를 만들어보세요! 🚀'
            }
          </SubTitle>
        </div>
        <PrimaryButton>
          <Plus style={{ width: 20, height: 20, marginRight: 8 }} />
          새로 만들기
        </PrimaryButton>
      </Header>

      {/* 통계 카드 */}
      <StatsGrid>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <SectionSub style={{ color: '#2563eb', marginBottom: 4, display: 'block' }}>총 목표</SectionSub>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a8a' }}>{stats.totalGoals}</div>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', marginTop: 4 }}>현재 진행중</div>
            </div>
            <StatIconBox $bg="#3b82f6">
              <Target style={{ width: 24, height: 24, color: '#fff' }} />
            </StatIconBox>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <SectionSub style={{ color: '#16a34a', marginBottom: 4, display: 'block' }}>진행중 프로젝트</SectionSub>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#14532d' }}>{stats.activeProjects}</div>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: 4 }}>활성 프로젝트</div>
            </div>
            <StatIconBox $bg="#22c55e">
              <Calendar style={{ width: 24, height: 24, color: '#fff' }} />
            </StatIconBox>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <SectionSub style={{ color: '#f59e0b', marginBottom: 4, display: 'block' }}>오늘 완료</SectionSub>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#78350f' }}>{stats.completedToday}/{stats.todayTasks}</div>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: 4 }}>할일 달성률</div>
            </div>
            <StatIconBox $bg="#f59e0b">
              <CheckCircle style={{ width: 24, height: 24, color: '#fff' }} />
            </StatIconBox>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <SectionSub style={{ color: '#a21caf', marginBottom: 4, display: 'block' }}>주간 진행률</SectionSub>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#581c87' }}>{stats.weeklyProgress}%</div>
              <div style={{ fontSize: '0.8rem', color: '#a21caf', marginTop: 4 }}>전체 진행도</div>
            </div>
            <StatIconBox $bg="#a21caf">
              <TrendingUp style={{ width: 24, height: 24, color: '#fff' }} />
            </StatIconBox>
          </div>
        </Card>
      </StatsGrid>

      {/* 목표 목록 */}
      {goals && goals.length > 0 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <SectionTitle>최근 목표</SectionTitle>
            <PrimaryButton style={{ background: 'none', color: '#2563eb', boxShadow: 'none', fontWeight: 500 }}>
              모두 보기
              <ArrowUpRight style={{ width: 16, height: 16, marginLeft: 4 }} />
            </PrimaryButton>
          </div>
          <GoalList>
            {goals.slice(0, 5).map((goal, index) => (
              <GoalItem key={goal.id}>
                <GoalIndex>{index + 1}</GoalIndex>
                <GoalInfo>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: 2 }}>{goal.title}</div>
                  {goal.description && (
                    <div style={{ fontSize: '0.95rem', color: '#4b5563' }}>{goal.description}</div>
                  )}
                </GoalInfo>
                <GoalDate>
                  {new Date(goal.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  <Dot />
                </GoalDate>
              </GoalItem>
            ))}
          </GoalList>
        </Card>
      )}

      {/* 오늘의 할일과 최근 활동 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <SectionTitle>오늘의 할일</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Dot style={{ background: '#22c55e' }} />
              <SectionSub>{stats.completedToday}/{stats.todayTasks} 완료</SectionSub>
            </div>
          </div>
          <TaskList>
            {todayTasks.map((task) => (
              <TaskRow key={task.id}>
                <TaskCheckbox checked={task.completed} readOnly />
                <div style={{ flex: 1 }}>
                  <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                  <BadgeRow>
                    <Badge $bg={task.type === 'routine' ? '#dbeafe' : '#bbf7d0'} $color={task.type === 'routine' ? '#1d4ed8' : '#15803d'}>
                      {task.type === 'routine' ? '루틴' : '할일'}
                    </Badge>
                    <Badge
                      $bg={task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#f3f4f6'}
                      $color={task.priority === 'high' ? '#b91c1c' : task.priority === 'medium' ? '#b45309' : '#374151'}
                    >
                      {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                  </BadgeRow>
                </div>
              </TaskRow>
            ))}
          </TaskList>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <SectionTitle>최근 활동</SectionTitle>
            <PrimaryButton style={{ background: 'none', color: '#2563eb', boxShadow: 'none', fontWeight: 500 }}>
              활동 기록
              <ArrowUpRight style={{ width: 16, height: 16, marginLeft: 4 }} />
            </PrimaryButton>
          </div>
          <ActivityList>
            {recentActivities.map((activity) => (
              <ActivityRow key={activity.id}>
                <ActivityIconBox $bg={activity.type === 'goal' ? '#3b82f6' : activity.type === 'routine' ? '#22c55e' : '#f59e0b'}>
                  <activity.icon style={{ width: 20, height: 20, color: '#fff' }} />
                </ActivityIconBox>
                <ActivityInfo>
                  <div style={{ fontWeight: 500, fontSize: '1rem', color: '#111827' }}>{activity.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{activity.time}</div>
                </ActivityInfo>
                <Dot />
              </ActivityRow>
            ))}
          </ActivityList>
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