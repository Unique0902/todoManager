import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

export default function AspirationEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [importance, setImportance] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/aspirations/${id}`).then(res => {
      setTitle(res.data.title || '');
      setCategory(res.data.category || '');
      setImportance(res.data.importance || '');
      setLinkedGoalId(res.data.linked_goal_id || '');
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(`/api/aspirations/${id}`, {
      title,
      category,
      importance: importance ? Number(importance) : undefined,
      linked_goal_id: linkedGoalId ? Number(linkedGoalId) : undefined,
    });
    navigate(-1);
  };

  return (
    <Container>
      <h2>아이디어/버킷리스트 수정</h2>
      <form onSubmit={handleSubmit}>
        <Label>아이디어명 *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>카테고리</Label>
        <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="예: 여행, 자기계발" />
        <Label>중요도 (1~5)</Label>
        <Input type="number" min={1} max={5} value={importance} onChange={e => setImportance(e.target.value)} />
        <Label>연결 목표 ID (선택)</Label>
        <Input type="number" value={linkedGoalId} onChange={e => setLinkedGoalId(e.target.value)} />
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 