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

export default function ProjectEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/v1/projects/${id}`).then(res => {
      setTitle(res.data.title || '');
      setDescription(res.data.description || '');
      setStartDate(res.data.start_date || '');
      setEndDate(res.data.end_date || '');
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(`/api/v1/projects/${id}`, {
      title,
      description,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    });
    navigate(-1);
  };

  return (
    <Container>
      <h2>프로젝트 수정</h2>
      <form onSubmit={handleSubmit}>
        <Label>프로젝트명 *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>설명</Label>
        <Input value={description} onChange={e => setDescription(e.target.value)} />
        <Label>시작일 *</Label>
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <Label>종료일 *</Label>
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 