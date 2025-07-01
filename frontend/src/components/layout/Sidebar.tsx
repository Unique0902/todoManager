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
import styled from 'styled-components';

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

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
`;
const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  padding: 0 1rem;
  border-bottom: 1px solid #e5e7eb;
`;
const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #2563eb;
`;
const Nav = styled.nav`
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.75rem;
  color: ${({ $active }) => ($active ? '#1d4ed8' : '#374151')};
  background: ${({ $active }) => ($active ? '#dbeafe' : 'transparent')};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #1d4ed8;
  }
`;
const UserBox = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  justify-content: space-between;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const UserName = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
`;
const UserEmail = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
`;
const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  border-radius: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #1d4ed8;
  }
`;

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarContainer>
      {/* 로고 영역 */}
      <LogoBox>
        <LogoText>TodoManager</LogoText>
      </LogoBox>
      {/* 네비게이션 메뉴 */}
      <Nav>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink key={item.name} to={item.href} $active={isActive}>
              <item.icon style={{ width: 20, height: 20, marginRight: 12 }} />
              {item.name}
            </NavLink>
          );
        })}
      </Nav>
      {/* 사용자 정보 및 로그아웃 */}
      <UserBox>
        {user && (
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>
        )}
        <LogoutBtn onClick={handleLogout}>
          <LogOut style={{ width: 20, height: 20, marginRight: 12 }} />
          로그아웃
        </LogoutBtn>
      </UserBox>
    </SidebarContainer>
  );
}; 