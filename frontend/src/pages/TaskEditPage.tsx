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

export default function TaskEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/v1/tasks/${id}`).then(res => {
      setTitle(res.data.title || '');
      setDueDate(res.data.due_date || '');
      setChecked(res.data.checked || false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/v1/tasks/${id}`, {
      title,
      due_date: dueDate || undefined,
      checked,
    });
    navigate(-1);
  };

  return (
    <Container>
      <h2>할일(Task) 수정</h2>
      <form onSubmit={handleSubmit}>
        <Label>할일명 *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>마감일</Label>
        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <Label>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> 완료 여부
        </Label>
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 