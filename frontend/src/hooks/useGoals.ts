import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../services/goals';
import type { Goal } from '../types';

// 모든 목표 조회 훅
export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 단일 목표 조회 훅
export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// 목표 트리 조회 훅
export const useGoalTree = (id: string) => {
  return useQuery({
    queryKey: ['goals', id, 'tree'],
    queryFn: () => goalsApi.getTree(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// 목표 생성 훅
export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      // 목표 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

// 목표 수정 훅
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      goalsApi.update(id, data),
    onSuccess: (updatedGoal) => {
      // 목표 목록과 개별 목표 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', updatedGoal.id] });
      queryClient.invalidateQueries({ queryKey: ['goals', updatedGoal.id, 'tree'] });
    },
  });
};

// 목표 삭제 훅
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.delete,
    onSuccess: (_, deletedId) => {
      // 목표 목록과 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.removeQueries({ queryKey: ['goals', deletedId] });
      queryClient.removeQueries({ queryKey: ['goals', deletedId, 'tree'] });
    },
  });
}; 