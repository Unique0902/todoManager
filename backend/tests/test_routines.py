import pytest
from httpx import AsyncClient
from datetime import date

@pytest.mark.asyncio
async def test_routine_crud(async_client: AsyncClient):
    # 1. 루틴 생성
    create_resp = await async_client.post(
        "/api/v1/routines/",
        json={
            "type": "routine", 
            "title": "테스트 루틴",
            "parent_type": "goal"
        }
    )
    assert create_resp.status_code == 201
    routine = create_resp.json()
    routine_id = routine["id"]
    assert routine["title"] == "테스트 루틴"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/routines/")
    assert list_resp.status_code == 200
    routines = list_resp.json()
    assert any(r["id"] == routine_id for r in routines)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/routines/{routine_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == routine_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/routines/{routine_id}",
        json={"title": "수정된 루틴", "type": "routine"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 루틴"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/routines/{routine_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/routines/{routine_id}")
    assert get_deleted.status_code == 404

@pytest.mark.asyncio
async def test_routine_performance_tracking(async_client: AsyncClient):
    # 1. 루틴 생성
    create_resp = await async_client.post(
        "/api/v1/routines/",
        json={
            "type": "routine", 
            "title": "성과 추적 루틴",
            "parent_type": "goal"
        }
    )
    assert create_resp.status_code == 201
    routine = create_resp.json()
    routine_id = routine["id"]

    # 2. 수행 이력 추가
    today = date.today()
    perform_resp = await async_client.post(
        f"/api/v1/routines/{routine_id}/perform",
        json=today.isoformat()
    )
    assert perform_resp.status_code == 201
    assert perform_resp.json()["success"] == True

    # 3. 수행 이력 조회
    performed_resp = await async_client.get(f"/api/v1/routines/{routine_id}/performed-dates")
    assert performed_resp.status_code == 200
    performed_dates = performed_resp.json()["performed_dates"]
    assert len(performed_dates) == 1
    assert performed_dates[0]["date"] == today.isoformat()

    # 4. 실패 기록 추가
    fail_resp = await async_client.post(
        f"/api/v1/routines/{routine_id}/fail",
        json={"date": "2024-01-01", "reason": "테스트 실패"}
    )
    assert fail_resp.status_code == 201
    assert fail_resp.json()["success"] == True

    # 5. 중복 수행 시도 (실패해야 함)
    duplicate_resp = await async_client.post(
        f"/api/v1/routines/{routine_id}/perform",
        json=today.isoformat()
    )
    assert duplicate_resp.status_code == 400
    assert "이미 해당 날짜에 성공 기록이 있습니다" in duplicate_resp.json()["detail"]

@pytest.mark.asyncio
async def test_routine_validation(async_client: AsyncClient):
    # 잘못된 parent_type으로 생성 시도
    create_resp = await async_client.post(
        "/api/v1/routines/",
        json={
            "type": "routine", 
            "title": "잘못된 루틴",
            "parent_type": "invalid_type"
        }
    )
    assert create_resp.status_code == 400
    assert "parent_type은 'goal', 'project'만 허용됩니다" in create_resp.json()["detail"] 