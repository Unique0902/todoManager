import apiClient from './api';

// TODO: 실제 모델 정의와 맞게 수정 필요
export interface MilestoneGroup {
  id: number;
  title: string;
  parent_id?: number | null;
  parent_type?: 'goal' | 'project' | null;
  description?: string;
  deleted?: boolean;
  // 필요한 필드 추가
}

export const milestoneGroupsApi = {
  getAll: () => apiClient.get<MilestoneGroup[]>('/milestone-groups').then(res => res.data),
  getById: (id: string|number) => apiClient.get<MilestoneGroup>(`/milestone-groups/${id}`).then(res => res.data),
  create: (data: Partial<MilestoneGroup>) => apiClient.post<MilestoneGroup>('/milestone-groups', data).then(res => res.data),
  update: (id: string|number, data: Partial<MilestoneGroup>) => apiClient.put<MilestoneGroup>(`/milestone-groups/${id}`, data).then(res => res.data),
  delete: (id: string|number) => apiClient.delete(`/milestone-groups/${id}`).then(res => res.data),
}; 