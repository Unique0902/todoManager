import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #2d6cdf;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
`;
const MoodSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const MOOD_OPTIONS = [
  '', '기쁨', '불안', '좌절', '보람', '화남', '무감정'
];

export default function EmotionJournalCreatePage() {
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [linkedRoutineId, setLinkedRoutineId] = useState('');
  const navigate = useNavigate();

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMoodTag(e.target.value);
    if (e.target.value !== '직접입력') setCustomMood('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/emotion-journals', {
      date,
      content,
      mood_tag: moodTag === '직접입력' ? customMood : moodTag,
      linked_routine_id: linkedRoutineId ? Number(linkedRoutineId) : undefined,
    });
    navigate(-1);
  };

  return (
    <Container>
      <h2>감정일기 생성</h2>
      <form onSubmit={handleSubmit}>
        <Label>날짜 *</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <Label>내용 *</Label>
        <TextArea value={content} onChange={e => setContent(e.target.value)} required />
        <Label>감정 태그</Label>
        <MoodSelect value={moodTag} onChange={handleMoodChange}>
          {MOOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || '선택안함'}</option>)}
          <option value="직접입력">직접입력</option>
        </MoodSelect>
        {moodTag === '직접입력' && (
          <Input value={customMood} onChange={e => setCustomMood(e.target.value)} placeholder="감정 직접입력" />
        )}
        <Label>연결 루틴 ID (선택)</Label>
        <Input type="number" value={linkedRoutineId} onChange={e => setLinkedRoutineId(e.target.value)} />
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 