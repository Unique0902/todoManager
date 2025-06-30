import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  GitBranch, 
  Repeat, 
  Heart, 
  Calendar, 
  BarChart3, 
  Lightbulb, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '목표 트리', href: '/tree', icon: GitBranch },
  { name: '루틴', href: '/routines', icon: Repeat },
  { name: '감정일기', href: '/emotion', icon: Heart },
  { name: '캘린더', href: '/calendar', icon: Calendar },
  { name: '분석', href: '/analysis', icon: BarChart3 },
  { name: '아이디어', href: '/aspiration', icon: Lightbulb },
  { name: '설정', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* 로고 영역 */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">TodoManager</h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 사용자 정보 및 로그아웃 */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </button>
      </div>
    </div>
  );
}; 