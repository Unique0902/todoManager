import apiClient from './api';

// TODO: 실제 모델 정의와 맞게 수정 필요
export interface OtherTask {
  id: number;
  title: string;
  due_date?: string;
  parent_id?: number | null;
  parent_type?: 'goal' | 'project' | null;
  // 필요한 필드 추가
}

export const otherTasksApi = {
  getAll: () => apiClient.get<OtherTask[]>('/other-tasks').then(res => res.data),
  getById: (id: string|number) => apiClient.get<OtherTask>(`/other-tasks/${id}`).then(res => res.data),
  create: (data: Partial<OtherTask>) => apiClient.post<OtherTask>('/other-tasks', data).then(res => res.data),
  update: (id: string|number, data: Partial<OtherTask>) => apiClient.put<OtherTask>(`/other-tasks/${id}`, data).then(res => res.data),
  delete: (id: string|number) => apiClient.delete(`/other-tasks/${id}`).then(res => res.data),
}; 