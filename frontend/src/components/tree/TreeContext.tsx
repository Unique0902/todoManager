import React, { useReducer, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { TreeContext } from './TreeContext';
import type { TreeNodeData, TreeAction } from './TreeTypes';

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
    case 'SET_TREE':
      return action.tree;
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

export const TreeProvider = ({ children }: { children: ReactNode }) => {
  const [tree, dispatch] = useReducer(treeReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/v1/goals/root')
      .then(res => {
        dispatch({ type: 'SET_TREE', tree: res.data });
        setLoading(false);
      })
      .catch(err => {
        setError('목표 데이터를 불러오지 못했습니다.' + (err?.message ? ` (${err.message})` : ''));
        setLoading(false);
      });
  }, []);

  return (
    <TreeContext.Provider value={{ tree, dispatch, loading, error }}>
      {children}
    </TreeContext.Provider>
  );
}; 