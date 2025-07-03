export type TreeNodeData = {
  id: string;
  type: string;
  title: string;
  children: TreeNodeData[];
};

export type TreeAction =
  | { type: 'SET_TREE'; tree: TreeNodeData[] }
  | { type: 'ADD_NODE'; parentId: string; node: Omit<TreeNodeData, 'children'> }
  | { type: 'EDIT_NODE'; nodeId: string; title: string }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'MOVE_NODE'; draggingId: string; dragOverId: string }; 