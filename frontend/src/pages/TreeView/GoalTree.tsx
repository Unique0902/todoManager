import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TreeNode } from '../../components/tree/TreeNode';
import styled from 'styled-components';
import { Pin, PinOff } from 'lucide-react';
import axios from 'axios';
import type { TreeNodeData } from '../../components/tree/TreeTypes';

const BackBtn = styled.button`
  margin: 32px 0 24px 0;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #e0e7ff; }
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.2rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e5e7eb;
  }
`;

const PinnedGrid = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
  }
`;

const PinnedCard = styled.div`
  background: #f3f4f6;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 180px;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 1rem;
    min-width: 0;
  }
`;

const TreeArea = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 48px;
  @media (max-width: 900px) {
    max-width: 100%;
    padding: 0 8px 48px 8px;
  }
`;

const GoalTree: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideRoutines, setHideRoutines] = useState(false);
  const [hideTasks, setHideTasks] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<boolean|undefined>(undefined);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) return;
    setLoading(true);
    setError(null);
    axios.get(`/api/v1/goals/${goalId}/tree`)
      .then(res => {
        setTreeData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('트리 데이터를 불러오지 못했습니다.' + (err?.message ? ` (${err.message})` : ''));
        setTreeData(null);
        setLoading(false);
      });
  }, [goalId]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!treeData) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 목표입니다.</div>;

  const handleNodeClick = (node: TreeNodeData) => {
    navigate(`/tree/${goalId}/node/${node.id}`);
  };
  const handlePinToggle = (id: string) => {
    setPinnedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };
  const pinnedNodes = [treeData, ...treeData.children].filter(n => pinnedIds.includes(n.id));
  const handleMoveNode = (draggingId: string, dragOverId: string) => {
    if (draggingId && dragOverId && draggingId !== dragOverId) {
      // dispatch({ type: 'MOVE_NODE', draggingId, dragOverId });
    }
  };
  return (
    <TreeArea>
      <BackBtn onClick={() => navigate('/tree')}>← 목표 리스트로</BackBtn>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>{treeData.title} 트리</h2>
      <ControlBar>
        <FilterLabel>
          <input type="checkbox" checked={hideRoutines} onChange={e => setHideRoutines(e.target.checked)} />
          루틴 숨기기
        </FilterLabel>
        <FilterLabel>
          <input type="checkbox" checked={hideTasks} onChange={e => setHideTasks(e.target.checked)} />
          할일 숨기기
        </FilterLabel>
        <SearchInput
          type="text"
          placeholder="노드 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={() => setExpanded(true)}>전체 확장</Button>
        <Button onClick={() => setExpanded(false)}>전체 축소</Button>
      </ControlBar>
      {pinnedNodes.length > 0 && (
        <PinnedGrid>
          {pinnedNodes.map(n => (
            <PinnedCard
              key={n.id}
              onClick={() => navigate(`/tree/${goalId}/node/${n.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Pin style={{ color: '#f59e0b', marginRight: 4 }} />
              {n.title}
              <button
                style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); handlePinToggle(n.id); }}
              >
                <PinOff size={18} />
              </button>
            </PinnedCard>
          ))}
        </PinnedGrid>
      )}
      <div style={{ marginTop: 24 }}>
        <TreeNode
          node={treeData}
          depth={0}
          onNodeClick={handleNodeClick}
          hideRoutines={hideRoutines}
          hideTasks={hideTasks}
          search={search}
          expanded={expanded}
          pinnedIds={pinnedIds}
          onPinToggle={handlePinToggle}
          draggingId={draggingId}
          setDraggingId={setDraggingId}
          dragOverId={dragOverId}
          setDragOverId={setDragOverId}
          onMoveNode={handleMoveNode}
          focusedId={focusedId}
          setFocusedId={setFocusedId}
        />
      </div>
    </TreeArea>
  );
};

export default GoalTree; 