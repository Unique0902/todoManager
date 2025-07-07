import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { routinesApi } from '../services/routines';
import type { Routine } from '../types';

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

const RoutineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    routinesApi.getById(id)
      .then(setRoutine)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    if (id) navigate(`/routine/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('정말로 이 루틴을 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.')) return;
    setDeleting(true);
    try {
      await routinesApi.delete(id);
      navigate(-1);
    } catch (e: unknown) {
      alert('삭제 중 오류 발생: ' + ((e as Error)?.message || ''));
    } finally {
      setDeleting(false);
    }
  };

  // 반복빈도 설명 생성 함수
  function getFrequencyLabel(r: Routine): string {
    if (!r.frequency_type || r.frequency_type === 'everyday') return '매일';
    if (r.frequency_type === 'weekly' && r.frequency_days && r.frequency_days.length > 0) {
      const dayMap: Record<string, string> = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };
      return r.frequency_days.map(d => dayMap[d] || d).join(', ');
    }
    if (r.frequency_type === 'count' && r.frequency_count) {
      return `주 ${r.frequency_count}회`;
    }
    if (r.frequency_type === 'custom' && r.frequency_custom) {
      return r.frequency_custom;
    }
    return r.frequency || '-';
  }

  if (loading) return <div style={{textAlign:'center',marginTop:80}}>로딩 중...</div>;
  if (error) return <div style={{textAlign:'center',marginTop:80,color:'#ef4444'}}>오류: {error}</div>;
  if (!routine) return <div style={{textAlign:'center',marginTop:80}}>루틴 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={cardStyle}>
      <div style={{color:'#3b82f6', fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:1}}>루틴 상세</div>
      <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
        <h1 style={{margin:0, fontSize:24, fontWeight:700}}>{routine.title}</h1>
        <button onClick={handleEdit} style={{marginLeft:16, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #3b82f6', background:'#fff', color:'#2563eb', cursor:'pointer'}}>수정</button>
        <button onClick={handleDelete} disabled={deleting} style={{marginLeft:8, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #ef4444', background:'#fff', color:'#ef4444', cursor:deleting?'not-allowed':'pointer', opacity:deleting?0.6:1}}>삭제</button>
      </div>
      {routine.description && (
        <div style={{marginBottom:20, color:'#374151', fontSize:16}}>{routine.description}</div>
      )}
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>시작일</span>
        <span style={valueStyle}>{routine.start_date}</span>
      </div>
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>반복 빈도</span>
        <span style={valueStyle}>{getFrequencyLabel(routine)}</span>
      </div>
      {routine.category && (
        <div style={{marginBottom:12}}>
          <span style={labelStyle}>카테고리</span>
          <span style={valueStyle}>{routine.category}</span>
        </div>
      )}
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>수행 횟수</span>
        <span style={valueStyle}>{routine.performed_count}</span>
      </div>
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>생성일</span>
        <span style={valueStyle}>{new Date(routine.created_at).toLocaleString()}</span>
      </div>
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>수정일</span>
        <span style={valueStyle}>{new Date(routine.updated_at).toLocaleString()}</span>
      </div>
      {/* 수행률, 실패 기록 등은 추후 추가 */}
    </div>
  );
};

export default RoutineDetailPage; 