import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTreeContext } from '../../components/tree/useTreeContext';
import styled from 'styled-components';
import type { TreeNodeData } from '../../components/tree/TreeTypes';
import axios from 'axios';

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
const ActionButton = styled.button`
  padding: 0.5rem 1.2rem;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
`;
const DeleteButton = styled(ActionButton)`
  background: #e11d48;
  &:hover { background: #be123c; }
`;
const DoneButton = styled(ActionButton)`
  background: #6b7280;
  &:hover { background: #374151; }
`;
const AddButton = styled(ActionButton)`
  background: #2563eb;
  &:hover { background: #1d4ed8; }
`;
const CardDeleteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e11d48;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.18s, transform 0.18s;
  &:hover {
    background: #be123c;
    transform: scale(1.12);
  }
`;

const TreeViewPage: React.FC = () => {
  const ctx = useTreeContext() as { tree?: TreeNodeData[] } | undefined;
  const [safeTree, setSafeTree] = useState<TreeNodeData[]>(ctx && Array.isArray(ctx.tree) ? ctx.tree : []);
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ctx && Array.isArray(ctx.tree)) {
      setSafeTree(ctx.tree);
    }
  }, [ctx && ctx.tree]);

  // 삭제 API 호출 및 리스트 갱신
  const handleDelete = async (goalId: string) => {
    if (!window.confirm('이 최종목표와 모든 하위 노드가 삭제됩니다. 정말 삭제하시겠습니까?')) return;
    setDeletingId(goalId);
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/v1/goals/${goalId}/tree`);
      setSafeTree(prev => prev.filter(goal => goal.id !== goalId));
    } catch (e: any) {
      setError('삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title>최종목표 리스트</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          {deleteMode ? (
            <DoneButton onClick={() => setDeleteMode(false)}>
              완료
            </DoneButton>
          ) : (
            <DeleteButton onClick={() => setDeleteMode(true)}>
              삭제
            </DeleteButton>
          )}
          <AddButton onClick={() => navigate('/goal/new')}>
            + 최종목표 추가
          </AddButton>
        </div>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <CardGrid>
        {safeTree.filter(goal => goal && goal.id).length > 0 ? (
          safeTree.filter(goal => goal && goal.id).map(goal => (
            <GoalCard key={goal.id} onClick={() => !deleteMode && navigate(`/tree/${goal.id}`)} style={{ position: 'relative', opacity: deletingId === goal.id ? 0.5 : 1 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>{goal.title}</div>
              <div style={{ color: '#2563eb', fontWeight: 500 }}>최종목표</div>
              {deleteMode && (
                <CardDeleteButton
                  onClick={e => { e.stopPropagation(); handleDelete(goal.id); }}
                  disabled={loading && deletingId === goal.id}
                  title="최종목표 및 하위 전체 삭제"
                >
                  ×
                </CardDeleteButton>
              )}
            </GoalCard>
          ))
        ) : (
          <div style={{ color: '#9ca3af', padding: '2rem', textAlign: 'center' }}>최종목표가 없습니다.</div>
        )}
      </CardGrid>
    </div>
  );
};

export default TreeViewPage; 