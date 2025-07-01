import apiClient, { apiResponse, getErrorMessage } from './api';
import type { Goal, TreeNode } from '../types';
import type { AxiosError } from 'axios';

// 목표 API 서비스
export const goalsApi = {
  // 모든 목표 조회
  getAll: async (): Promise<Goal[]> => {
    try {
      const response = await apiClient.get('/goals/');
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 단일 목표 조회
  getById: async (id: string): Promise<Goal> => {
    try {
      const response = await apiClient.get(`/goals/${id}`);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 목표 생성
  create: async (data: Partial<Goal>): Promise<Goal> => {
    try {
      const response = await apiClient.post('/goals/', data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 목표 수정
  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    try {
      const response = await apiClient.put(`/goals/${id}`, data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 목표 삭제
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/goals/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 트리 구조 조회
  getTree: async (id: string): Promise<TreeNode> => {
    try {
      const response = await apiClient.get(`/goals/${id}/tree`);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },
}; 