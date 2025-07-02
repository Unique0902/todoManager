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
  const [isMilestone, setIsMilestone] = useState(false);
  const [milestoneDate, setMilestoneDate] = useState('');
  const [orderIndex, setOrderIndex] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tasks/${id}`).then(res => {
      setTitle(res.data.title || '');
      setDueDate(res.data.due_date || '');
      setChecked(res.data.checked || false);
      setIsMilestone(res.data.is_milestone || false);
      setMilestoneDate(res.data.milestone_date || '');
      setOrderIndex(res.data.order_index || '');
    });
  }, [id]);

  const showMilestoneFields = isMilestone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(`/api/tasks/${id}`, {
      title,
      due_date: dueDate || undefined,
      checked,
      is_milestone: isMilestone,
      milestone_date: showMilestoneFields ? milestoneDate : undefined,
      order_index: showMilestoneFields && orderIndex ? Number(orderIndex) : undefined,
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
        <Label>
          <input type="checkbox" checked={isMilestone} onChange={e => setIsMilestone(e.target.checked)} /> 마일스톤 특성
        </Label>
        {showMilestoneFields && (
          <>
            <Label>마일스톤 일자</Label>
            <Input type="date" value={milestoneDate} onChange={e => setMilestoneDate(e.target.value)} />
            <Label>마일스톤 내 순서</Label>
            <Input type="number" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} />
          </>
        )}
        <Button type="submit">저장</Button>
      </form>
    </Container>
  );
} 