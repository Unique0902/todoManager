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
  const [frequencyType, setFrequencyType] = useState('everyday');
  const [frequencyDays, setFrequencyDays] = useState<string[]>([]);
  const [frequencyCount, setFrequencyCount] = useState('');
  const [frequencyCustom, setFrequencyCustom] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/v1/routines/${id}`).then(res => {
      setTitle(res.data.title || '');
      setStartDate(res.data.start_date || '');
      // 구조화된 frequency 필드 파싱
      if (res.data.frequency_type) setFrequencyType(res.data.frequency_type);
      if (res.data.frequency_days) setFrequencyDays(res.data.frequency_days);
      if (res.data.frequency_count) setFrequencyCount(String(res.data.frequency_count));
      if (res.data.frequency_custom) setFrequencyCustom(res.data.frequency_custom);
      if (CATEGORY_OPTIONS.includes(res.data.category)) {
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

  const handleDayToggle = (day: string) => {
    setFrequencyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  // frequencyType 변경 시 관련 상태 초기화
  const handleFrequencyTypeChange = (type: string) => {
    setFrequencyType(type);
    setFrequencyDays([]);
    setFrequencyCount('');
    setFrequencyCustom('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 검증 로직 추가
    if (frequencyType === 'weekly' && frequencyDays.length === 0) {
      alert('요일을 1개 이상 선택하세요.');
      return;
    }
    if (frequencyType === 'count') {
      const n = Number(frequencyCount);
      if (!frequencyCount || isNaN(n)) {
        alert('주 몇 회 반복할지 숫자를 입력하세요.');
        return;
      }
      if (n < 1 || n > 7) {
        alert('주 반복 횟수는 1~7 사이여야 합니다.');
        return;
      }
    }
    await axios.put(`/api/v1/routines/${id}`, {
      title,
      start_date: startDate || undefined,
      frequency_type: frequencyType,
      frequency_days: frequencyType === 'weekly' ? frequencyDays : undefined,
      frequency_count: frequencyType === 'count' ? Number(frequencyCount) : undefined,
      frequency_custom: frequencyType === 'custom' ? frequencyCustom : undefined,
      category: category === '직접입력' ? customCategory : category,
    });
    navigate(-1);
  };

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const daysEng = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <Container>
      <h2>루틴 수정</h2>
      <form onSubmit={handleSubmit}>
        <Label>루틴명 *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
        <Label>시작일 *</Label>
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <Label>반복 빈도 *</Label>
        <div style={{marginBottom:16}}>
          <label><input type="radio" name="frequencyType" value="everyday" checked={frequencyType==='everyday'} onChange={()=>handleFrequencyTypeChange('everyday')} /> 매일</label>
          <label style={{marginLeft:16}}><input type="radio" name="frequencyType" value="weekly" checked={frequencyType==='weekly'} onChange={()=>handleFrequencyTypeChange('weekly')} /> 요일 선택</label>
          <label style={{marginLeft:16}}><input type="radio" name="frequencyType" value="count" checked={frequencyType==='count'} onChange={()=>handleFrequencyTypeChange('count')} /> 주 X회</label>
          <label style={{marginLeft:16}}><input type="radio" name="frequencyType" value="custom" checked={frequencyType==='custom'} onChange={()=>handleFrequencyTypeChange('custom')} /> 직접입력</label>
        </div>
        {frequencyType === 'weekly' && (
          <div style={{marginBottom:16}}>
            {days.map((d, i) => (
              <label key={d} style={{marginRight:8}}>
                <input type="checkbox" checked={frequencyDays.includes(daysEng[i])} onChange={()=>handleDayToggle(daysEng[i])} /> {d}
              </label>
            ))}
          </div>
        )}
        {frequencyType === 'count' && (
          <div style={{marginBottom:16}}>
            <Input type="number" min={1} value={frequencyCount} onChange={e => setFrequencyCount(e.target.value)} placeholder="주 몇 회" required={frequencyType==='count'} />
          </div>
        )}
        {frequencyType === 'custom' && (
          <div style={{marginBottom:16}}>
            <Input value={frequencyCustom} onChange={e => setFrequencyCustom(e.target.value)} placeholder="반복 패턴 직접입력" required={frequencyType==='custom'} />
          </div>
        )}
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