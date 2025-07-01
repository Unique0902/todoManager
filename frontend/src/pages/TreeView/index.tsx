import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTreeContext } from '../../components/tree/TreeContext';
import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;
const GoalCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem 1.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const TreeViewPage: React.FC = () => {
  const { tree } = useTreeContext();
  const navigate = useNavigate();
  return (
    <div style={{ padding: 32 }}>
      <Title>목표 리스트</Title>
      <CardGrid>
        {tree.map(goal => (
          <GoalCard key={goal.id} onClick={() => navigate(`/tree/${goal.id}`)}>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>{goal.title}</div>
            <div style={{ color: '#2563eb', fontWeight: 500 }}>{goal.type}</div>
          </GoalCard>
        ))}
      </CardGrid>
    </div>
  );
};

export default TreeViewPage; 