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

const NodeEdit: React.FC = () => {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find(g => g.id === goalId);
  const node = goal ? findNodeById([goal], nodeId || '') : null;
  const [title, setTitle] = useState(node?.title || '');
  if (!goal || !node) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 노드입니다.</div>;
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'EDIT_NODE', nodeId: node.id, title });
    navigate(`/tree/${goalId}/node/${nodeId}`);
  };
  return (
    <FormBox>
      <Title>노드 수정</Title>
      <form onSubmit={handleSave}>
        <Label>제목</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <SaveBtn type="submit">저장</SaveBtn>
      </form>
    </FormBox>
  );
};

export default NodeEdit; 