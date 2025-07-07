import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { goalsApi } from '../services/goals';
import type { Goal } from '../types';

const labelStyle = { color: '#6b7280', fontSize: 14, marginRight: 8 };
const valueStyle = { fontWeight: 500 };
const cardStyle = {
  maxWidth: 520,
  margin: '40px auto',
  padding: 32,
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
};
const badgeStyle = {
  display: 'inline-block',
  background: '#3b82f6',
  color: '#fff',
  borderRadius: 12,
  padding: '2px 12px',
  fontSize: 13,
  marginLeft: 8,
  verticalAlign: 'middle',
};

const GoalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    goalsApi.getById(id)
      .then(setGoal)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    if (id) navigate(`/goal/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('정말로 이 목표를 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.')) return;
    setDeleting(true);
    try {
      await goalsApi.delete(id);
      navigate('/tree');
    } catch (e: unknown) {
      alert('삭제 중 오류 발생: ' + ((e as Error)?.message || ''));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:80}}>로딩 중...</div>;
  if (error) return <div style={{textAlign:'center',marginTop:80,color:'#ef4444'}}>오류: {error}</div>;
  if (!goal) return <div style={{textAlign:'center',marginTop:80}}>목표 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={cardStyle}>
      <div style={{color:'#3b82f6', fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:1}}>목표 상세</div>
      <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
        <h1 style={{margin:0, fontSize:28, fontWeight:700}}>{goal.title}</h1>
        {goal.is_milestone && (
          <span style={badgeStyle}>마일스톤</span>
        )}
        <button onClick={handleEdit} style={{marginLeft:16, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #3b82f6', background:'#fff', color:'#2563eb', cursor:'pointer'}}>수정</button>
        <button onClick={handleDelete} disabled={deleting} style={{marginLeft:8, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #ef4444', background:'#fff', color:'#ef4444', cursor:deleting?'not-allowed':'pointer', opacity:deleting?0.6:1}}>삭제</button>
      </div>
      {goal.description && (
        <div style={{marginBottom:20, color:'#374151', fontSize:16}}>{goal.description}</div>
      )}
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>생성일</span>
        <span style={valueStyle}>{new Date(goal.created_at).toLocaleString()}</span>
      </div>
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>수정일</span>
        <span style={valueStyle}>{new Date(goal.updated_at).toLocaleString()}</span>
      </div>
      {goal.milestone_date && (
        <div style={{marginBottom:12}}>
          <span style={labelStyle}>마일스톤 날짜</span>
          <span style={valueStyle}>{goal.milestone_date}</span>
        </div>
      )}
      {/* 진행률, 분석 등은 추후 추가 */}
    </div>
  );
};

export default GoalDetailPage; 