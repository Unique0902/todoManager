import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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

// 액션 타입
export type TreeAction =
  | { type: 'ADD_NODE'; parentId: string; node: Omit<TreeNodeData, 'children'> }
  | { type: 'EDIT_NODE'; nodeId: string; title: string }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'MOVE_NODE'; draggingId: string; dragOverId: string };

function addNode(tree: TreeNodeData[], parentId: string, node: Omit<TreeNodeData, 'children'>): TreeNodeData[] {
  return tree.map(n => {
    if (n.id === parentId) {
      return { ...n, children: [...n.children, { ...node, children: [] }] };
    } else if (n.children) {
      return { ...n, children: addNode(n.children, parentId, node) };
    } else {
      return n;
    }
  });
}
function editNode(tree: TreeNodeData[], nodeId: string, title: string): TreeNodeData[] {
  return tree.map(n => {
    if (n.id === nodeId) {
      return { ...n, title };
    } else if (n.children) {
      return { ...n, children: editNode(n.children, nodeId, title) };
    } else {
      return n;
    }
  });
}
function deleteNode(tree: TreeNodeData[], nodeId: string): TreeNodeData[] {
  return tree.filter(n => n.id !== nodeId).map(n => ({
    ...n,
    children: n.children ? deleteNode(n.children, nodeId) : [],
  }));
}

function moveNode(tree: TreeNodeData[], draggingId: string, dragOverId: string): TreeNodeData[] {
  // 같은 부모 내에서만 순서 변경
  function helper(nodes: TreeNodeData[]): TreeNodeData[] {
    const draggingIdx = nodes.findIndex(n => n.id === draggingId);
    const dragOverIdx = nodes.findIndex(n => n.id === dragOverId);
    if (draggingIdx !== -1 && dragOverIdx !== -1) {
      const arr = [...nodes];
      const [draggingNode] = arr.splice(draggingIdx, 1);
      arr.splice(dragOverIdx, 0, draggingNode);
      return arr;
    }
    return nodes.map(n => ({ ...n, children: helper(n.children) }));
  }
  return helper(tree);
}

function treeReducer(state: TreeNodeData[], action: TreeAction): TreeNodeData[] {
  switch (action.type) {
    case 'ADD_NODE':
      return addNode(state, action.parentId, action.node);
    case 'EDIT_NODE':
      return editNode(state, action.nodeId, action.title);
    case 'DELETE_NODE':
      return deleteNode(state, action.nodeId);
    case 'MOVE_NODE':
      return moveNode(state, action.draggingId, action.dragOverId);
    default:
      return state;
  }
}

const TreeContext = createContext<{
  tree: TreeNodeData[];
  dispatch: React.Dispatch<TreeAction>;
} | undefined>(undefined);

export const TreeProvider = ({ children }: { children: ReactNode }) => {
  const [tree, dispatch] = useReducer(treeReducer, initialTree);
  return (
    <TreeContext.Provider value={{ tree, dispatch }}>
      {children}
    </TreeContext.Provider>
  );
};

export function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('useTreeContext must be used within TreeProvider');
  return ctx;
} 