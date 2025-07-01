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

const DetailBox = styled.div`
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
const Type = styled.div`
  font-size: 1.1rem;
  color: #2563eb;
  margin-bottom: 1.2rem;
`;
const Desc = styled.div`
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 2rem;
`;
const BackBtn = styled.button`
  margin-top: 24px;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #e0e7ff; }
`;
const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 2rem;
`;
const ActionBtn = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1d4ed8; }
`;

const NodeDetail: React.FC = () => {
  const { goalId, nodeId } = useParams<{ goalId: string; nodeId: string }>();
  const navigate = useNavigate();
  const { tree } = useTreeContext();
  const goal = tree.find(g => g.id === goalId);
  const node = goal ? findNodeById([goal], nodeId || '') : null;
  if (!goal || !node) return <div style={{ padding: 40, textAlign: 'center' }}>존재하지 않는 노드입니다.</div>;
  return (
    <DetailBox>
      <Title>{node.title}</Title>
      <Type>타입: {node.type}</Type>
      <Desc>ID: {node.id}</Desc>
      <ActionBar>
        <ActionBtn onClick={() => navigate(`/tree/${goalId}/node/${nodeId}/edit`)}>수정</ActionBtn>
        <ActionBtn onClick={() => navigate(`/tree/${goalId}/node/${nodeId}/delete`)}>삭제</ActionBtn>
        <ActionBtn onClick={() => navigate(`/tree/${goalId}/node/${nodeId}/create`)}>자식 노드 생성</ActionBtn>
      </ActionBar>
      <BackBtn onClick={() => navigate(-1)}>← 트리로 돌아가기</BackBtn>
    </DetailBox>
  );
};

export default NodeDetail; 