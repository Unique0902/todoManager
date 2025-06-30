import React from 'react';
import { Card } from '../../components/common/Card';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // 임시 데이터 (나중에 API로 교체)
  const stats = {
    totalGoals: 5,
    activeProjects: 3,
    todayTasks: 8,
    completedToday: 3,
    weeklyProgress: 75,
    activeRoutines: 4
  };

  const todayTasks = [
    { id: 1, title: '프로젝트 기획서 작성', type: 'task', completed: false },
    { id: 2, title: '운동하기', type: 'routine', completed: true },
    { id: 3, title: '독서 30분', type: 'routine', completed: false },
    { id: 4, title: '팀 미팅 준비', type: 'task', completed: false },
  ];

  const recentActivities = [
    { id: 1, type: 'goal', title: '새로운 목표 생성', time: '2시간 전' },
    { id: 2, type: 'routine', title: '운동 루틴 완료', time: '4시간 전' },
    { id: 3, type: 'task', title: '보고서 제출 완료', time: '1일 전' },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">오늘의 대시보드</h1>
          <p className="text-gray-600">오늘 하루도 힘내세요!</p>
        </div>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          새로 만들기
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 목표</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGoals}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">진행중 프로젝트</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">오늘 완료</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}/{stats.todayTasks}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">주간 진행률</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weeklyProgress}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Clock className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 루틴</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRoutines}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 오늘의 할일 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">오늘의 할일</h3>
            <span className="text-sm text-gray-500">{stats.completedToday}/{stats.todayTasks} 완료</span>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className={`ml-3 flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.type === 'routine' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.type === 'routine' ? '루틴' : '할일'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'goal' ? 'bg-primary-500' :
                  activity.type === 'routine' ? 'bg-success-500' :
                  'bg-warning-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}; 