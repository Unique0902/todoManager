import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { TreeNodeData } from './TreeView';
import { Pin, PinOff } from 'lucide-react';

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onAddChild?: (parentId: string, title: string, type: string) => void;
  onEdit?: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onNodeClick?: (node: TreeNodeData) => void;
  hideRoutines?: boolean;
  hideTasks?: boolean;
  search?: string;
  expanded?: boolean;
  pinnedIds?: string[];
  onPinToggle?: (id: string) => void;
  draggingId?: string | null;
  setDraggingId?: (id: string | null) => void;
  dragOverId?: string | null;
  setDragOverId?: (id: string | null) => void;
  onMoveNode?: (draggingId: string, dragOverId: string) => void;
  focusedId?: string | null;
  setFocusedId?: (id: string | null) => void;
}

const NodeBox = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  background: ${({ selected }) => (selected ? '#dbeafe' : 'transparent')};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s, transform 0.15s;
  overflow: visible;
  min-width: 0;
  width: 100%;
  &:hover {
    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
    transform: scale(1.015);
    background: #f3f4f6;
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(37,99,235,0.10);
  }
  &:hover .node-actions {
    opacity: 1;
  }
  @media (max-width: 600px) {
    font-size: 0.97rem;
  }
`;
const NodeIcon = styled.span`
  display: inline-block;
  width: 20px;
  text-align: center;
  margin-right: 8px;
`;
const NodeActions = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
  min-width: 0;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  background: #fff;
  padding: 0 4px;
`;
const ActionBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  padding: 2px 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  &:hover {
    background: #e5e7eb;
    transform: scale(1.08);
  }
  &:active {
    transform: scale(0.96);
  }
`;
const InlineForm = styled.form`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 32px;
  margin-top: 4px;
`;
const InlineInput = styled.input`
  padding: 2px 8px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
`;
const Menu = styled.div`
  position: absolute;
  top: 32px;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 10;
  min-width: 100px;
`;
const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;
const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 0.75rem;
  margin-left: 8px;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  transition: background 0.2s, color 0.2s, transform 0.15s;
  &:hover {
    filter: brightness(1.08);
    transform: scale(1.07);
  }
`;

const getIcon = (type: string) => {
  switch (type) {
    case 'goal': return '🎯';
    case 'project': return '📁';
    case 'milestone_group': return '🏁';
    case 'task': return '✅';
    case 'routine': return '🔁';
    default: return '•';
  }
};

const ChildrenWrapper = styled.div`
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
  overflow: hidden;
`;

const NodeContent = styled.div<{ $depth: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 0;
  overflow: hidden;
  padding-left: ${({ $depth }) => $depth * 24}px;
  @media (max-width: 600px) {
    padding-left: ${({ $depth }) => $depth * 12}px;
  }
`;

export const TreeNode: React.FC<TreeNodeProps> = ({
  node, depth, selectedId, onSelect, onAddChild, onEdit, onDelete, onNodeClick, hideRoutines, hideTasks, search, expanded, pinnedIds, onPinToggle,
  draggingId, setDraggingId, dragOverId, setDragOverId, onMoveNode, focusedId, setFocusedId
}) => {
  const selected = node.id === selectedId;
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addType, setAddType] = useState('task');
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [open, setOpen] = useState(true);
  const isPinned = pinnedIds?.includes(node.id);

  // 드래그&드롭 상태
  const isDragging = draggingId === node.id;
  const isDragOver = dragOverId === node.id;

  // 포커스 상태
  const isFocused = focusedId === node.id;

  useEffect(() => {
    if (expanded !== undefined) setOpen(expanded);
  }, [expanded]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (addTitle.trim() && onAddChild) {
      onAddChild(node.id, addTitle, addType);
      setAddTitle('');
      setShowAdd(false);
    }
  };
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && onEdit) {
      onEdit(node.id, editTitle);
      setEditMode(false);
    }
  };

  // 필터링: 루틴/할일 숨기기
  if ((hideRoutines && node.type === 'routine') || (hideTasks && node.type === 'task')) {
    return null;
  }
  // 검색어 필터링: 검색어가 있을 때, 해당 노드 또는 하위 노드에 검색어가 없으면 렌더링하지 않음
  const lowerSearch = search?.toLowerCase() || '';
  const match = node.title.toLowerCase().includes(lowerSearch);
  const hasSearch = !!lowerSearch;
  // 하위 노드 중 검색어 포함 여부
  const childMatches = node.children?.some(child => {
    // 재귀적으로 하위 노드까지 검사
    const check = (n: TreeNodeData): boolean => n.title.toLowerCase().includes(lowerSearch) || n.children?.some(check);
    return check(child);
  });
  if (hasSearch && !match && !childMatches) {
    return null;
  }

  return (
    <div>
      <NodeBox
        selected={selected}
        onClick={() => {
          onSelect && onSelect(node.id);
          onNodeClick && onNodeClick(node);
        }}
        style={{
          ...(hasSearch && match ? { background: '#fef9c3' } : {}),
          ...(isDragging ? { opacity: 0.5, border: '2px dashed #2563eb' } : {}),
          ...(isDragOver ? { background: '#dbeafe', border: '2px solid #2563eb' } : {}),
          ...(isFocused ? { outline: '2px solid #2563eb', zIndex: 2 } : {})
        }}
        tabIndex={0}
        role="treeitem"
        aria-label={node.title + (selected ? ' (선택됨)' : '')}
        aria-selected={selected}
        onFocus={() => setFocusedId && setFocusedId(node.id)}
        onBlur={() => setFocusedId && setFocusedId(null)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect && onSelect(node.id);
            onNodeClick && onNodeClick(node);
          }
          // 방향키 네비게이션(1차: 상하만, 트리 전체를 flat하게 탐색)
          if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && setFocusedId) {
            e.preventDefault();
            // 기존 flatten(nodeRoot) → 현재 노드만 flat 배열로 대체 (임시)
            const flat: string[] = [node.id];
            const idx = flat.indexOf(node.id);
            if (e.key === 'ArrowDown' && idx < flat.length - 1) setFocusedId(flat[idx + 1]);
            if (e.key === 'ArrowUp' && idx > 0) setFocusedId(flat[idx - 1]);
          }
          // 좌우: → 펼치기, ← 접기
          if (e.key === 'ArrowRight' && !open) setOpen(true);
          if (e.key === 'ArrowLeft' && open) setOpen(false);
        }}
        draggable
        onDragStart={e => {
          e.stopPropagation();
          setDraggingId && setDraggingId(node.id);
        }}
        onDragEnd={e => {
          e.stopPropagation();
          setDraggingId && setDraggingId(null);
          setDragOverId && setDragOverId(null);
        }}
        onDragEnter={e => {
          e.preventDefault();
          e.stopPropagation();
          if (setDragOverId && draggingId && draggingId !== node.id && depth === 0) {
            setDragOverId(node.id);
          }
        }}
        onDragLeave={e => {
          e.stopPropagation();
          setDragOverId && setDragOverId(null);
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          if (onMoveNode && draggingId && dragOverId === node.id) {
            onMoveNode(draggingId, dragOverId);
          }
          setDraggingId && setDraggingId(null);
          setDragOverId && setDragOverId(null);
        }}
      >
        <NodeContent $depth={depth}>
          <NodeIcon onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{ cursor: 'pointer' }}>
            {node.children && node.children.length > 0 ? (open ? '▼' : '▶') : getIcon(node.type)}
          </NodeIcon>
          {editMode ? (
            <InlineForm onSubmit={handleEdit} style={{ marginLeft: 0 }}>
              <InlineInput value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus />
              <ActionBtn type="submit">저장</ActionBtn>
              <ActionBtn type="button" onClick={e => { e.stopPropagation(); setEditMode(false); }}>취소</ActionBtn>
            </InlineForm>
          ) : (
            <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
              {node.title}
            </span>
          )}
          {node.type === 'routine' && (
            <Badge $color="#1d4ed8" $bg="#dbeafe">루틴</Badge>
          )}
          {node.type === 'milestone_group' && (
            <Badge $color="#b91c1c" $bg="#fee2e2">마일스톤</Badge>
          )}
          {node.type === 'task' && (
            <Badge $color="#15803d" $bg="#bbf7d0">할일</Badge>
          )}
          {node.type === 'project' && (
            <Badge $color="#a21caf" $bg="#f3e8ff">프로젝트</Badge>
          )}
          {node.type === 'goal' && (
            <Badge $color="#2563eb" $bg="#dbeafe">목표</Badge>
          )}
          {(node.type === 'goal' || node.type === 'project') && onPinToggle && (
            <button style={{ background: 'none', border: 'none', marginLeft: 4, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onPinToggle(node.id); }}>
              {isPinned ? <Pin style={{ color: '#f59e0b' }} size={16} /> : <PinOff style={{ color: '#9ca3af' }} size={16} />}
            </button>
          )}
        </NodeContent>
        <NodeActions className="node-actions">
          <ActionBtn onClick={e => { e.stopPropagation(); setShowAdd(v => !v); setShowMenu(false); }}>+</ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>…</ActionBtn>
          {showMenu && (
            <Menu onClick={e => e.stopPropagation()}>
              <MenuItem onClick={() => { setEditMode(true); setShowMenu(false); }}>수정</MenuItem>
              <MenuItem onClick={() => { onDelete && onDelete(node.id); setShowMenu(false); }}>삭제</MenuItem>
            </Menu>
          )}
        </NodeActions>
      </NodeBox>
      {showAdd && (
        <InlineForm onSubmit={handleAdd}>
          <InlineInput value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="자식 노드 제목" autoFocus />
          <select value={addType} onChange={e => setAddType(e.target.value)}>
            <option value="task">할일</option>
            <option value="project">프로젝트</option>
            <option value="routine">루틴</option>
          </select>
          <ActionBtn type="submit">추가</ActionBtn>
          <ActionBtn type="button" onClick={() => setShowAdd(false)}>취소</ActionBtn>
        </InlineForm>
      )}
      {open && node.children && node.children.length > 0 && (
        <ChildrenWrapper>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onNodeClick={onNodeClick}
              hideRoutines={hideRoutines}
              hideTasks={hideTasks}
              search={search}
              expanded={expanded}
              pinnedIds={pinnedIds}
              onPinToggle={onPinToggle}
              draggingId={draggingId}
              setDraggingId={setDraggingId}
              dragOverId={dragOverId}
              setDragOverId={setDragOverId}
              onMoveNode={onMoveNode}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
            />
          ))}
        </ChildrenWrapper>
      )}
    </div>
  );
}; 