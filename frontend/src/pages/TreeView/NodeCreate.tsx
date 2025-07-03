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
const Select = styled.select`
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

export default function NodeCreate() {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find(g => g.id === goalId);
  const parent = goal ? findNodeById([goal], nodeId || '') : null;
  const [title, setTitle] = useState('');
  const [type, setType] = useState('task');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTree() {
    try {
      const res = await axios.get('/api/v1/goals/1/tree');
      dispatch({ type: 'SET_TREE', tree: [res.data] });
    } catch (e) {}
  }

  if (!goal || !parent) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 부모 노드입니다.</div>;

  // 부모 타입별 허용 자식 타입 정의
  const getAllowedChildTypes = (parentType: string) => {
    if (parentType === 'goal' || parentType === 'project') {
      return ['goal', 'project', 'milestone_group', 'task', 'routine'];
    }
    if (parentType === 'milestone_group') {
      return ['goal', 'project', 'task']; // 모두 is_milestone: true로 생성됨
    }
    return [];
  };
  const allowedTypes = getAllowedChildTypes(parent.type);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      const payload = {
        title,
        parent_id: parent.id,
        parent_type: parent.type,
        type,
      };
      if (type === 'task') endpoint = '/api/v1/tasks';
      else if (type === 'project') endpoint = '/api/v1/projects';
      else if (type === 'routine') endpoint = '/api/v1/routines';
      else if (type === 'milestone_group') endpoint = '/api/v1/milestone-groups';
      else endpoint = '/api/v1/tasks'; // fallback
      await axios.post(endpoint, payload);
      await fetchTree();
      setLoading(false);
      navigate(`/tree/${goalId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.detail || '노드 생성에 실패했습니다.');
      } else {
        setError('노드 생성에 실패했습니다.');
      }
      setLoading(false);
    }
  };

  return (
    <FormBox>
      <Title>자식 노드 생성</Title>
      <form onSubmit={handleSave}>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Label>제목</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required disabled={loading} />
        <Label>타입</Label>
        <Select value={type} onChange={e => setType(e.target.value)} disabled={loading}>
          {allowedTypes.includes('goal') && <option value="goal">목표</option>}
          {allowedTypes.includes('project') && <option value="project">프로젝트</option>}
          {allowedTypes.includes('milestone_group') && <option value="milestone_group">마일스톤 그룹</option>}
          {allowedTypes.includes('task') && <option value="task">할일</option>}
          {allowedTypes.includes('routine') && <option value="routine">루틴</option>}
        </Select>
        <SaveBtn type="submit" disabled={loading}>{loading ? '생성 중...' : '생성'}</SaveBtn>
      </form>
    </FormBox>
  );
} 