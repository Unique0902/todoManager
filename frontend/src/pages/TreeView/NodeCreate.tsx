import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTreeContext } from '../../components/tree/TreeContext';
import type { TreeNodeData } from '../../components/tree/TreeContext';
import styled from 'styled-components';

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

const NodeCreate: React.FC = () => {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find(g => g.id === goalId);
  const parent = goal ? findNodeById([goal], nodeId || '') : null;
  const [title, setTitle] = useState('');
  const [type, setType] = useState('task');
  if (!goal || !parent) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 부모 노드입니다.</div>;
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${type}_${Date.now()}`;
    dispatch({ type: 'ADD_NODE', parentId: parent.id, node: { id: newId, type, title } });
    navigate(`/tree/${goalId}/node/${newId}`);
  };
  return (
    <FormBox>
      <Title>자식 노드 생성</Title>
      <form onSubmit={handleSave}>
        <Label>제목</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>타입</Label>
        <Select value={type} onChange={e => setType(e.target.value)}>
          <option value="task">할일</option>
          <option value="project">프로젝트</option>
          <option value="routine">루틴</option>
        </Select>
        <SaveBtn type="submit">생성</SaveBtn>
      </form>
    </FormBox>
  );
};

export default NodeCreate; 