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

const FormBox = styled.div`
  max-width: 480px;
  margin: 48px auto;
  background: #f9fafb;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2.5rem 2rem;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;
const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 1.1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin-bottom: 1.2rem;
`;
const SaveBtn = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #1d4ed8; }
`;
const ErrorMsg = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
`;

export default function NodeEdit() {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find((g: TreeNodeData) => g.id === goalId);
  const node = goal ? findNodeById([goal], nodeId || '') : null;
  const [title, setTitle] = useState(node?.title || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTree() {
    try {
      const res = await axios.get('/api/v1/goals/1/tree');
      dispatch({ type: 'SET_TREE', tree: [res.data] });
    } catch (e) {
      // 무시
    }
  }

  if (!goal || !node) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 노드입니다.</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await axios.patch(endpoint, { title });
      await fetchTree();
      setLoading(false);
      navigate(`/tree/${goalId}/node/${nodeId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || '노드 수정에 실패했습니다.');
      } else {
        setError('노드 수정에 실패했습니다.');
      }
      setLoading(false);
    }
  };

  return (
    <FormBox>
      <Title>노드 수정</Title>
      <form onSubmit={handleSave}>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Label>제목</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required disabled={loading} />
        <SaveBtn type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</SaveBtn>
      </form>
    </FormBox>
  );
} 