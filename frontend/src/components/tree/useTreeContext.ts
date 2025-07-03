import { useContext } from 'react';
import { TreeContext } from './TreeContext';

export function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('useTreeContext must be used within TreeProvider');
  return ctx;
} 