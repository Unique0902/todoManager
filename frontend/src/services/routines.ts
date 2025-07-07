import apiClient, { apiResponse, getErrorMessage } from './api';
import type { Routine } from '../types';
import type { AxiosError } from 'axios';

export const routinesApi = {
  // 모든 루틴 조회
  getAll: async (): Promise<Routine[]> => {
    try {
      const response = await apiClient.get('/routines/');
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 단일 루틴 조회
  getById: async (id: string): Promise<Routine> => {
    try {
      const response = await apiClient.get(`/routines/${id}`);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 루틴 생성
  create: async (data: Partial<Routine>): Promise<Routine> => {
    try {
      const response = await apiClient.post('/routines/', data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 루틴 수정
  update: async (id: string, data: Partial<Routine>): Promise<Routine> => {
    try {
      const response = await apiClient.put(`/routines/${id}`, data);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 루틴 삭제
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/routines/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 루틴 수행(체크)
  perform: async (routineId: string, performed_date: string): Promise<{ success: boolean; performed_dates: { date: string; success: boolean }[] }> => {
    try {
      const response = await apiClient.post(
        `/routines/${routineId}/perform`,
        JSON.stringify(performed_date),
        { headers: { 'Content-Type': 'application/json' } }
      );
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },

  // 루틴 수행 취소(체크 해제)
  unperform: async (routineId: string, performed_date: string): Promise<{ success: boolean; performed_dates: { date: string; success: boolean }[] }> => {
    try {
      const response = await apiClient.delete(`/routines/${routineId}/perform/${performed_date}`);
      return apiResponse(response);
    } catch (error) {
      throw new Error(getErrorMessage(error as AxiosError));
    }
  },
}; 