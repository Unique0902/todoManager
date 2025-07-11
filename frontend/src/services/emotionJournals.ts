import apiClient from './api';

export interface EmotionJournal {
  id: number;
  date: string;
  content: string;
  mood_tag?: string;
  linked_routine_id?: number;
  created_at: string;
}

export const emotionJournalsApi = {
  // 특정 날짜의 감정일기 조회
  getByDate: async (date: string): Promise<EmotionJournal | null> => {
    const res = await apiClient.get(`/emotion-journals?date=${date}`);
    return res.data.length > 0 ? res.data[0] : null;
  },
  // 전체 감정일기 조회
  getAll: async (): Promise<EmotionJournal[]> => {
    const res = await apiClient.get('/emotion-journals');
    return res.data;
  },
  // 감정일기 생성
  create: async (data: Partial<EmotionJournal>): Promise<EmotionJournal> => {
    const res = await apiClient.post('/emotion-journals', data);
    return res.data;
  },
}; 