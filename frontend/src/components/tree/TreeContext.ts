import { createContext } from 'react';
import type { TreeNodeData, TreeAction } from './TreeTypes';

export const TreeContext = createContext<{
  tree: TreeNodeData[];
  dispatch: React.Dispatch<TreeAction>;
  loading: boolean;
  error: string | null;
} | undefined>(undefined); 