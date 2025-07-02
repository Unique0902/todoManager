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
const CategorySelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const CATEGORY_OPTIONS = [
  '', '운동', '감정관리', '외형관리', '학습', '업무', '건강관리', '취미'
];

export default function RoutineEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/routines/${id}`).then(res => {
      setTitle(res.data.title || '');
      setStartDate(res.data.start_date || '');
      setFrequency(res.data.frequency || '');
      if (
        CATEGORY_OPTIONS.includes(res.data.category)
      ) {
        setCategory(res.data.category);
        setCustomCategory('');
      } else if (res.data.category) {
        setCategory('직접입력');
        setCustomCategory(res.data.category);
      } else {
        setCategory('');
        setCustomCategory('');
      }
    });
  }, [id]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    if (e.target.value !== '직접입력') setCustomCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(`/api/routines/${id}`, {
      title,
      start_date: startDate || undefined,
      frequency,
      category: category === '직접입력' ? customCategory : category,
    });
    navigate(-1);
  };

  return (
    <Container>
      <h2>루틴 수정</h2>
      <form onSubmit={handleSubmit}>
        <Label>루틴명 *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>시작일 *</Label>
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <Label>반복 빈도 *</Label>
        <Input value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="예: 매일, 주 3회" required />
        <Label>카테고리</Label>
        <CategorySelect value={category} onChange={handleCategoryChange}>
          {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || '선택안함'}</option>)}
          <option value="직접입력">직접입력</option>
        </CategorySelect>
        {category === '직접입력' && (
          <Input value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="카테고리 직접입력" />
        )}
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 