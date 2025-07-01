import React, { useState } from 'react';
import styled from 'styled-components';
import { TreeNode } from './TreeNode';

// 트리 노드 타입 정의
export type TreeNodeData = {
  id: string;
  type: string;
  title: string;
  children: TreeNodeData[];
};

const initialTree: TreeNodeData[] = [
  {
    id: 'goal1',
    type: 'goal',
    title: '건강한 삶',
    children: [
      {
        id: 'project1',
        type: 'project',
        title: '12주 운동 챌린지',
        children: [
          {
            id: 'milestone1',
            type: 'milestone_group',
            title: '주차별 목표',
            children: [
              { id: 'task1', type: 'task', title: '1주차 완료', children: [] },
              { id: 'task2', type: 'task', title: '2주차 완료', children: [] },
            ],
          },
          { id: 'routine1', type: 'routine', title: '매일 30분 운동', children: [] },
          { id: 'task3', type: 'task', title: '운동 계획 세우기', children: [] },
        ],
      },
    ],
  },
  {
    id: 'goal2',
    type: 'goal',
    title: '나만의 서비스 만들기',
    children: [
      {
        id: 'project2',
        type: 'project',
        title: '할일 정리 앱 개발',
        children: [
          {
            id: 'milestone2',
            type: 'milestone_group',
            title: '개발 단계',
            children: [
              { id: 'task4', type: 'task', title: 'MVP UI 완성', children: [] },
              { id: 'task5', type: 'task', title: '기본 기능 구현', children: [] },
            ],
          },
          { id: 'routine2', type: 'routine', title: '매일 1시간 코딩', children: [] },
          { id: 'task6', type: 'task', title: '디자인 시안 확정', children: [] },
        ],
      },
    ],
  },
];

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
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

const TreeViewLayout = styled.div`
  display: flex;
  gap: 2rem;
`;
const TreeArea = styled.div`
  flex: 2;
`;
const DetailPanel = styled.div`
  flex: 1;
  background: #f9fafb;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  min-width: 260px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;
const DetailTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
const DetailType = styled.div`
  font-size: 1rem;
  color: #2563eb;
  margin-bottom: 1rem;
`;

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

function addChild(tree: TreeNodeData[], parentId: string, title: string, type: string): TreeNodeData[] {
  return tree.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [
          ...node.children,
          { id: `${type}_${Date.now()}`, type, title, children: [] },
        ],
      };
    } else if (node.children) {
      return { ...node, children: addChild(node.children, parentId, title, type) };
    } else {
      return node;
    }
  });
}

function editNode(tree: TreeNodeData[], id: string, title: string): TreeNodeData[] {
  return tree.map(node => {
    if (node.id === id) {
      return { ...node, title };
    } else if (node.children) {
      return { ...node, children: editNode(node.children, id, title) };
    } else {
      return node;
    }
  });
}

function deleteNode(tree: TreeNodeData[], id: string): TreeNodeData[] {
  return tree.filter(node => node.id !== id).map(node => ({
    ...node,
    children: node.children ? deleteNode(node.children, id) : [],
  }));
}

export const TreeView: React.FC = () => {
  const [tree, setTree] = useState<TreeNodeData[]>(initialTree);
  const [hideRoutines, setHideRoutines] = useState(false);
  const [hideTasks, setHideTasks] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string|null>(null);

  const selectedNode = selectedId ? findNodeById(tree, selectedId) : null;

  const handleAddChild = (parentId: string, title: string, type: string) => {
    setTree(prev => addChild(prev, parentId, title, type));
  };
  const handleEdit = (id: string, title: string) => {
    setTree(prev => editNode(prev, id, title));
  };
  const handleDelete = (id: string) => {
    setTree(prev => deleteNode(prev, id));
  };

  return (
    <TreeViewLayout>
      <TreeArea>
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
          <Button>전체 확장</Button>
          <Button>전체 축소</Button>
        </ControlBar>
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddChild={handleAddChild}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </TreeArea>
      <DetailPanel>
        {selectedNode ? (
          <>
            <DetailTitle>{selectedNode.title}</DetailTitle>
            <DetailType>{selectedNode.type}</DetailType>
            <div>ID: {selectedNode.id}</div>
            {/* 추후 상세 정보/액션 추가 */}
          </>
        ) : (
          <div style={{ color: '#9ca3af' }}>노드를 선택하면 상세 정보가 표시됩니다.</div>
        )}
      </DetailPanel>
    </TreeViewLayout>
  );
}; 