import React from 'react';
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

const NodeDelete: React.FC = () => {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree, dispatch } = useTreeContext();
  const goal = tree.find(g => g.id === goalId);
  const node = goal ? findNodeById([goal], nodeId || '') : null;
  if (!goal || !node) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 노드입니다.</div>;
  const handleDelete = () => {
    dispatch({ type: 'DELETE_NODE', nodeId: node.id });
    navigate('/tree');
  };
  return (
    <Box>
      <Title>노드 삭제</Title>
      <Danger>정말로 "{node.title}" 노드를 삭제하시겠습니까?</Danger>
      <BtnBar>
        <DangerBtn onClick={handleDelete}>삭제</DangerBtn>
        <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
      </BtnBar>
    </Box>
  );
};

export default NodeDelete; 