import React, { useState } from 'react';
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
  LogOut,
  ChevronLeft,
  ChevronRight
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

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 200;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  width: ${({ $collapsed }) => ($collapsed ? '0' : '240px')};
  min-width: 0;
  transition: width 0.2s cubic-bezier(0.4,0,0.2,1);
  box-sizing: border-box;
  box-shadow: 2px 0 12px rgba(0,0,0,0.07);
  overflow: hidden;
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '2.5rem 0 2.5rem 0')};
`;
const SidebarInner = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  flex-direction: column;
  height: 100%;
`;
const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-left: 2rem;
`;
const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  margin: 0;
  height: 32px;
  display: flex;
  align-items: center;
`;
const CollapseBtn = styled.button<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  background: none;
  border: none;
  box-shadow: none;
  border-radius: 50%;
  cursor: pointer;
  color: #374151;
  font-size: 1.5rem;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #f3f4f6;
    color: #2563eb;
  }
  ${({ $collapsed }) => $collapsed && `
    position: fixed;
    left: 0;
    top: 24px;
    z-index: 300;
    margin-left: 0;
  `}
`;
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  padding: 0 1.5rem;
`;
const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.08rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#1d4ed8' : '#374151')};
  background: ${({ $active }) => ($active ? '#dbeafe' : 'transparent')};
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  min-width: 0;
  justify-content: flex-start;
  &:hover {
    background: #f3f4f6;
    color: #1d4ed8;
  }
`;
const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 2.2rem 1.5rem 0 1.5rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
  width: 100%;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-align: left;
  width: 100%;
`;
const UserName = styled.p`
  font-size: 1.05rem;
  font-weight: 600;
  color: #22223b;
  margin: 0;
`;
const UserEmail = styled.p`
  font-size: 0.92rem;
  color: #6b7280;
  margin: 0;
`;
const LogoutBtn = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  border-radius: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1.2rem 0.5rem 0;
  min-width: 90px;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  justify-content: flex-start;
  width: 100%;
  &:hover {
    background: #f3f4f6;
    color: #1d4ed8;
  }
`;

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <SidebarContainer $collapsed={collapsed}>
        <SidebarInner $collapsed={collapsed}>
          <TopRow>
            <LogoText>TodoManager</LogoText>
            <CollapseBtn onClick={() => setCollapsed(true)}>
              <ChevronLeft size={24} />
            </CollapseBtn>
          </TopRow>
          <Nav>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink key={item.name} to={item.href} $active={isActive}>
                  <item.icon style={{ width: 20, height: 20 }} />
                  {item.name}
                </NavLink>
              );
            })}
          </Nav>
          <UserBox>
            {user && (
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
            )}
            <LogoutBtn onClick={handleLogout}>
              <LogOut style={{ width: 20, height: 20 }} />
              로그아웃
            </LogoutBtn>
          </UserBox>
        </SidebarInner>
      </SidebarContainer>
      {collapsed && (
        <CollapseBtn $collapsed={collapsed} onClick={() => setCollapsed(false)}>
          <ChevronRight size={24} />
        </CollapseBtn>
      )}
    </>
  );
}; 