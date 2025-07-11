import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksApi } from '../services/tasks';
import type { Task } from '../types';

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

// 마이크로초가 포함된 날짜 문자열을 안전하게 파싱
const parseDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  const trimmed = dateStr.split('.')[0];
  return new Date(trimmed);
};

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tasksApi.getById(id)
      .then(setTask)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    if (id) navigate(`/task/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('정말로 이 할일을 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.')) return;
    setDeleting(true);
    try {
      await tasksApi.delete(id);
      navigate('/tree');
    } catch (e: unknown) {
      alert('삭제 중 오류 발생: ' + ((e as Error)?.message || ''));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:80}}>로딩 중...</div>;
  if (error) return <div style={{textAlign:'center',marginTop:80,color:'#ef4444'}}>오류: {error}</div>;
  if (!task) return <div style={{textAlign:'center',marginTop:80}}>할일 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={cardStyle}>
      <div style={{color:'#3b82f6', fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:1}}>할일 상세</div>
      <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
        <h1 style={{margin:0, fontSize:24, fontWeight:700}}>{task.title}</h1>
        {task.is_milestone && (
          <span style={badgeStyle}>마일스톤</span>
        )}
        {task.checked && (
          <span style={{...badgeStyle, background:'#22c55e', marginLeft:8}}>완료</span>
        )}
        <button onClick={handleEdit} style={{marginLeft:16, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #3b82f6', background:'#fff', color:'#2563eb', cursor:'pointer'}}>수정</button>
        <button onClick={handleDelete} disabled={deleting} style={{marginLeft:8, padding:'4px 14px', fontSize:15, borderRadius:8, border:'1px solid #ef4444', background:'#fff', color:'#ef4444', cursor:deleting?'not-allowed':'pointer', opacity:deleting?0.6:1}}>삭제</button>
      </div>
      {task.description && (
        <div style={{marginBottom:20, color:'#374151', fontSize:16}}>{task.description}</div>
      )}
      {task.due_date && (
        <div style={{marginBottom:12}}>
          <span style={labelStyle}>마감일</span>
          <span style={valueStyle}>{task.due_date}</span>
        </div>
      )}
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>생성일</span>
        <span style={valueStyle}>{task.created_at ? parseDate(task.created_at).toLocaleString() : ''}</span>
      </div>
      <div style={{marginBottom:12}}>
        <span style={labelStyle}>수정일</span>
        <span style={valueStyle}>{task.updated_at ? parseDate(task.updated_at).toLocaleString() : ''}</span>
      </div>
      {task.milestone_date && (
        <div style={{marginBottom:12}}>
          <span style={labelStyle}>마일스톤 날짜</span>
          <span style={valueStyle}>{task.milestone_date}</span>
        </div>
      )}
      {task.history_log && (() => {
        let logs: any[] = [];
        try {
          logs = JSON.parse(task.history_log);
        } catch {}
        const dueLogs = logs.filter(l => l.field === 'due_date');
        if (dueLogs.length === 0) return null;
        return (
          <div style={{marginTop:32}}>
            <div style={{fontWeight:600,marginBottom:8,fontSize:16,color:'#2563eb'}}>미룸/날짜 변경 이력</div>
            <ul style={{paddingLeft:0,listStyle:'none'}}>
              {dueLogs.map((log, idx) => (
                <li key={idx} style={{marginBottom:8,fontSize:15}}>
                  <span style={{color:'#64748b'}}>{log.changed_at ? new Date(log.changed_at).toLocaleString() : ''}</span>
                  <span style={{marginLeft:8}}>→ <b>{log.before}</b> 에서 <b>{log.after}</b>로 변경</span>
                  {log.reason && <span style={{marginLeft:8,color:'#f59e42'}}>[{log.reason}]</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
      {/* 기타 필드, 액션 등은 추후 추가 */}
    </div>
  );
};

export default TaskDetailPage; 