import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routinesApi } from '../services/routines';
import type { Routine } from '../types';

function isTodayRoutine(routine: Routine) {
  const today = new Date();
  const startDate = new Date(routine.start_date);
  if (isNaN(startDate.getTime())) return false;
  if (startDate > today) return false;
  // 구조화 반복빈도 정책에 따라 판별
  const daysEng = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayEng = daysEng[today.getDay()];
  if (!routine.frequency_type || routine.frequency_type === 'everyday') return true;
  if (routine.frequency_type === 'weekly' && Array.isArray(routine.frequency_days)) {
    return routine.frequency_days.includes(todayEng);
  }
  // 주X회(count)는 오늘 해당되는지 정책상 판별 불가(추후 확장 가능)
  if (routine.frequency_type === 'count') return true; // 임시: 주X회는 매일 표시
  if (routine.frequency_type === 'custom') return true; // 임시: 직접입력은 매일 표시
  // 혹시 모를 예전 데이터 호환
  const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
  const todayKor = daysKor[today.getDay()];
  if (routine.frequency?.includes('매일')) return true;
  if (routine.frequency?.includes(todayKor)) return true;
  return false;
}

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

const RoutinesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<Routine[]>({
    queryKey: ['routines'],
    queryFn: routinesApi.getAll,
  });
  const [filter, setFilter] = useState<'all' | 'today'>('all');

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>루틴 목록을 불러오는 중...</div>;
  }
  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>루틴 목록을 불러오는데 실패했습니다.</div>;
  }
  if (!data || data.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center' }}>등록된 루틴이 없습니다.</div>;
  }

  const activeRoutines = data.filter(r => !r.deleted);
  const filteredRoutines = filter === 'all'
    ? activeRoutines
    : activeRoutines.filter(isTodayRoutine);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>루틴 목록</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: filter === 'all' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            background: filter === 'all' ? '#eff6ff' : '#fff',
            color: filter === 'all' ? '#2563eb' : '#374151',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >전체 루틴</button>
        <button
          onClick={() => setFilter('today')}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: filter === 'today' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            background: filter === 'today' ? '#eff6ff' : '#fff',
            color: filter === 'today' ? '#2563eb' : '#374151',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >오늘의 루틴</button>
      </div>
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>{filter === 'all' ? '전체 루틴' : '오늘의 루틴'}</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredRoutines.length === 0 && <div>{filter === 'all' ? '루틴이 없습니다.' : '오늘 수행할 루틴이 없습니다.'}</div>}
          {filteredRoutines.map(routine => (
            <div
              key={routine.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                background: '#fff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => navigate(`/routine/${routine.id}`)}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{routine.title}</div>
              <div style={{ color: '#6b7280', margin: '4px 0 8px 0' }}>{routine.category ? routine.category : '카테고리 없음'} · {getFrequencyLabel(routine)}</div>
              <div style={{ display: 'flex', gap: 24, fontSize: '0.95rem' }}>
                <span>수행 횟수: <b>{routine.performed_count}</b></span>
                <span>시작일: <b>{routine.start_date}</b></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoutinesPage; 