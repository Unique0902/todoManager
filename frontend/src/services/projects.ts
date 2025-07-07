import apiClient, { apiResponse, getErrorMessage } from './api';
import type { Project } from '../types';
import type { AxiosError } from 'axios';

export const projectsApi = {
  // 모든 프로젝트 조회
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get('/projects/');
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 단일 프로젝트 조회
  getById: async (id: string): Promise<Project> => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 프로젝트 생성
  create: async (data: Partial<Project>): Promise<Project> => {
    try {
      const response = await apiClient.post('/projects/', data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 프로젝트 수정
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const response = await apiClient.put(`/projects/${id}`, data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 프로젝트 삭제
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },
}; 