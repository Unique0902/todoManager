import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTreeContext } from '../../components/tree/useTreeContext';
import type { TreeNodeData } from '../../components/tree/TreeTypes';
import styled from 'styled-components';
import axios from 'axios';

function findNodeById(tree: TreeNodeData[], id: string): TreeNodeData | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

const Box = styled.div`
  max-width: 420px;
  margin: 64px auto;
  background: #f9fafb;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2.5rem 2rem;
  text-align: center;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;
const Danger = styled.div`
  color: #dc2626;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;
const BtnBar = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;
const DangerBtn = styled.button`
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #b91c1c; }
`;
const CancelBtn = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #e5e7eb; }
`;
const ErrorMsg = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
`;

export default function NodeDelete() {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find((g: TreeNodeData) => g.id === goalId);
  const node = goal ? findNodeById([goal], nodeId || '') : null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTree() {
    try {
      const res = await axios.get('/api/v1/goals/1/tree');
      dispatch({ type: 'SET_TREE', tree: [res.data] });
    } catch {
      // 무시
    }
  }

  if (!goal || !node) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 노드입니다.</div>;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      if (node.type === 'task') endpoint = `/api/v1/tasks/${node.id}`;
      else if (node.type === 'project') endpoint = `/api/v1/projects/${node.id}`;
      else if (node.type === 'routine') endpoint = `/api/v1/routines/${node.id}`;
      else if (node.type === 'milestone_group') endpoint = `/api/v1/milestone-groups/${node.id}`;
      else if (node.type === 'other_task') endpoint = `/api/v1/other-tasks/${node.id}`;
      else endpoint = `/api/v1/tasks/${node.id}`;
      await axios.delete(endpoint);
      await fetchTree();
      setLoading(false);
      navigate(`/tree/${goalId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || '노드 삭제에 실패했습니다.');
      } else {
        setError('노드 삭제에 실패했습니다.');
      }
      setLoading(false);
    }
  };

  return (
    <Box>
      <Title>노드 삭제</Title>
      <Danger>정말로 "{node.title}" 노드를 삭제하시겠습니까?</Danger>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <BtnBar>
        <DangerBtn onClick={handleDelete} disabled={loading}>{loading ? '삭제 중...' : '삭제'}</DangerBtn>
        <CancelBtn onClick={() => navigate(-1)} disabled={loading}>취소</CancelBtn>
      </BtnBar>
    </Box>
  );
} 