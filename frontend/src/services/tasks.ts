import apiClient from './api';
import type { Task } from '../types';

export const tasksApi = {
  // 단일 할일 조회
  getById: (id: string | number) => apiClient.get<Task>(`/tasks/${id}`).then(res => res.data),
  // 전체 할일 목록 조회
  getAll: () => apiClient.get<Task[]>('/tasks').then(res => res.data),
  // 할일 생성
  create: (data: Partial<Task>) => apiClient.post<Task>('/tasks', data).then(res => res.data),
  // 할일 수정
  update: (id: string | number, data: Partial<Task>) => apiClient.put<Task>(`/tasks/${id}`, data).then(res => res.data),
  // 할일 삭제
  delete: (id: string | number) => apiClient.delete(`/tasks/${id}`).then(res => res.data),
}; 