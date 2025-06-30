from fastapi import APIRouter, HTTPException, Depends, status, Body
from sqlmodel import Session, select
from typing import List
from ..models.routine import Routine
from ..database import get_session
from datetime import datetime, date
import json

router = APIRouter()

# Routine 생성
@router.post("/", response_model=Routine, status_code=status.HTTP_201_CREATED)
def create_routine(routine: Routine, session: Session = Depends(get_session)):
    # parent_type 유효성 검사 (항상)
    if routine.parent_type not in ['goal', 'project']:
        raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project'만 허용됩니다.")
    # parent_id 유효성 검사
    if routine.parent_id is not None:
        if routine.parent_id == routine.id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        if routine.parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, routine.parent_id)
        elif routine.parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, routine.parent_id)
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    routine.created_at = datetime.utcnow()
    routine.updated_at = datetime.utcnow()
    session.add(routine)
    session.commit()
    session.refresh(routine)
    return routine

# Routine 전체 조회
@router.get("/", response_model=List[Routine])
def read_routines(session: Session = Depends(get_session)):
    routines = session.exec(select(Routine)).all()
    return routines

# Routine 단일 조회
@router.get("/{routine_id}", response_model=Routine)
def read_routine(routine_id: int, session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine

# Routine 수정
@router.put("/{routine_id}", response_model=Routine)
def update_routine(routine_id: int, routine_update: Routine, session: Session = Depends(get_session)):
    db_routine = session.get(Routine, routine_id)
    if not db_routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    update_data = routine_update.model_dump(exclude_unset=True)
    if "parent_id" in update_data and update_data["parent_id"] is not None:
        if update_data["parent_id"] == routine_id:
            raise HTTPException(status_code=400, detail="자기 자신을 부모로 지정할 수 없습니다.")
        parent_type = update_data.get("parent_type", db_routine.parent_type)
        if parent_type not in ['goal', 'project']:
            raise HTTPException(status_code=400, detail="parent_type은 'goal', 'project'만 허용됩니다.")
        if parent_type == 'goal':
            from ..models.goal import Goal
            parent = session.get(Goal, update_data["parent_id"])
        elif parent_type == 'project':
            from ..models.project import Project
            parent = session.get(Project, update_data["parent_id"])
        else:
            parent = None
        if not parent or getattr(parent, 'deleted', False):
            raise HTTPException(status_code=400, detail="parent_id에 해당하는 부모가 존재하지 않습니다.")
    for key, value in update_data.items():
        setattr(db_routine, key, value)
    db_routine.updated_at = datetime.utcnow()
    session.add(db_routine)
    session.commit()
    session.refresh(db_routine)
    return db_routine

# Routine 삭제 (soft delete)
@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_routine(routine_id: int, session: Session = Depends(get_session)):
    db_routine = session.get(Routine, routine_id)
    if not db_routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    session.delete(db_routine)
    session.commit()
    return None

# 루틴 수행 이력 추가
@router.post("/{routine_id}/perform", status_code=201)
def add_performed_date(routine_id: int, performed_date: date = Body(...), session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    performed_dates = json.loads(routine.performed_dates) if routine.performed_dates else []
    failed_logs = json.loads(routine.failed_logs) if routine.failed_logs else []
    if any(d['date'] == performed_date.isoformat() for d in performed_dates):
        raise HTTPException(status_code=400, detail="이미 해당 날짜에 성공 기록이 있습니다.")
    if any(f['date'] == performed_date.isoformat() for f in failed_logs):
        raise HTTPException(status_code=400, detail="이미 해당 날짜에 실패 기록이 있습니다.")
    performed_dates.append({"date": performed_date.isoformat(), "success": True})
    routine.performed_dates = json.dumps(performed_dates)
    session.add(routine)
    session.commit()
    return {"success": True, "performed_dates": performed_dates}

# 루틴 수행 이력 전체 조회
@router.get("/{routine_id}/performed-dates")
def get_performed_dates(routine_id: int, session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    performed_dates = json.loads(routine.performed_dates) if routine.performed_dates else []
    return {"performed_dates": performed_dates}

# 루틴 실패 기록 추가
@router.post("/{routine_id}/fail", status_code=201)
def add_failed_log(routine_id: int, fail: dict = Body(...), session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    fail_date = fail.get("date")
    if not fail_date:
        raise HTTPException(status_code=400, detail="date 필드는 필수입니다.")
    performed_dates = json.loads(routine.performed_dates) if routine.performed_dates else []
    failed_logs = json.loads(routine.failed_logs) if routine.failed_logs else []
    if any(f['date'] == fail_date for f in failed_logs):
        raise HTTPException(status_code=400, detail="이미 해당 날짜에 실패 기록이 있습니다.")
    if any(d['date'] == fail_date for d in performed_dates):
        raise HTTPException(status_code=400, detail="이미 해당 날짜에 성공 기록이 있습니다.")
    failed_logs.append(fail)
    routine.failed_logs = json.dumps(failed_logs)
    session.add(routine)
    session.commit()
    return {"success": True, "failed_logs": failed_logs}

# 루틴 실패 기록 전체 조회
@router.get("/{routine_id}/failed-logs")
def get_failed_logs(routine_id: int, session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    failed_logs = json.loads(routine.failed_logs) if routine.failed_logs else []
    return {"failed_logs": failed_logs} 