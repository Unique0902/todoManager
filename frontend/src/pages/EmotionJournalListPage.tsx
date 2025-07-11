import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { EmotionJournal } from '../services/emotionJournals';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
const ListItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Button = styled.button`
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
`;
const AddBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #2563eb;
  border-radius: 10px;
  padding: 24px 0;
  margin-top: 24px;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #e0e7ff;
  }
`;
const DangerButton = styled(Button)`
  background: #ef4444;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;
const MoodSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;
const MOOD_OPTIONS = ['', '기쁨', '불안', '좌절', '보람', '화남', '무감정'];

export default function EmotionJournalListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const today = dayjs().format('YYYY-MM-DD');
  const date = params.get('date') || today;
  const [journals, setJournals] = useState<EmotionJournal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [editId, setEditId] = useState<number|null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState('');
  const [editCustomMood, setEditCustomMood] = useState('');

  const fetchJournals = async () => {
    setLoading(true);
    const res = await axios.get(`/api/v1/emotion-journals?date=${date}`);
    setJournals(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchJournals(); }, [date]);
  // 날짜 input 변경 시 URL 쿼리 갱신
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/emotion-journal?date=${e.target.value}`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/v1/emotion-journals', {
      date,
      content,
      mood_tag: moodTag === '직접입력' ? customMood : moodTag,
    });
    setContent(''); setMoodTag(''); setCustomMood(''); setShowForm(false);
    fetchJournals();
  };
  const handleDelete = async (id: number) => {
    await axios.delete(`/api/v1/emotion-journals/${id}`);
    fetchJournals();
  };
  const handleEdit = (j: EmotionJournal) => {
    setEditId(j.id);
    setEditContent(j.content);
    setEditMood(j.mood_tag || '');
    setEditCustomMood('');
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/v1/emotion-journals/${editId}`, {
      content: editContent,
      mood_tag: editMood === '직접입력' ? editCustomMood : editMood,
    });
    setEditId(null); setEditContent(''); setEditMood(''); setEditCustomMood('');
    fetchJournals();
  };

  return (
    <Container>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
        <h2 style={{margin:0}}>{date} 감정일기</h2>
        <input type="date" value={date} onChange={handleDateChange} style={{fontSize:16,padding:6,borderRadius:6,border:'1px solid #ddd'}} />
      </div>
      {loading ? <div>로딩중...</div> : (
        <List>
          {journals.length === 0 && <div>감정일기가 없습니다.</div>}
          {journals.map(j => (
            <ListItem key={j.id}>
              {editId === j.id ? (
                <form onSubmit={handleEditSubmit}>
                  <TextArea value={editContent} onChange={e=>setEditContent(e.target.value)} required />
                  <MoodSelect value={editMood} onChange={e=>setEditMood(e.target.value)}>
                    {MOOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || '감정 선택안함'}</option>)}
                    <option value="직접입력">직접입력</option>
                  </MoodSelect>
                  {editMood === '직접입력' && (
                    <Input value={editCustomMood} onChange={e=>setEditCustomMood(e.target.value)} placeholder="감정 직접입력" />
                  )}
                  <Button type="submit">수정완료</Button>
                  <Button type="button" onClick={()=>setEditId(null)}>취소</Button>
                </form>
              ) : (
                <>
                  <div style={{fontWeight:600}}>{j.content}</div>
                  <div style={{color:'#2563eb'}}>{j.mood_tag ? j.mood_tag : '감정 없음'}</div>
                  <div style={{fontSize:12,color:'#888'}}>{j.created_at?.slice(0,16).replace('T',' ')}</div>
                  <div>
                    <Button onClick={()=>handleEdit(j)}>수정</Button>
                    <DangerButton onClick={()=>handleDelete(j.id)}>삭제</DangerButton>
                  </div>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
      <AddBox onClick={()=>setShowForm(v=>!v)}>
        <Plus size={28} color="#2563eb" style={{marginRight:8}} />
        <span style={{fontSize:18,color:'#2563eb',fontWeight:600}}>
          {showForm ? '작성 취소' : '새 감정일기 작성'}
        </span>
      </AddBox>
      {showForm && (
        <form onSubmit={handleCreate} style={{margin:'24px 0'}}>
          <TextArea value={content} onChange={e=>setContent(e.target.value)} placeholder="감정일기 내용" required />
          <MoodSelect value={moodTag} onChange={e=>setMoodTag(e.target.value)}>
            {MOOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || '감정 선택안함'}</option>)}
            <option value="직접입력">직접입력</option>
          </MoodSelect>
          {moodTag === '직접입력' && (
            <Input value={customMood} onChange={e=>setCustomMood(e.target.value)} placeholder="감정 직접입력" />
          )}
          <Button type="submit">저장</Button>
        </form>
      )}
    </Container>
  );
} 