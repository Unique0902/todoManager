import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_goal_crud(async_client: AsyncClient):
    # 1. 목표 생성
    create_resp = await async_client.post(
        "/api/v1/goals/",
        json={"type": "goal", "title": "테스트 목표"}
    )
    assert create_resp.status_code == 201
    goal = create_resp.json()
    goal_id = goal["id"]
    assert goal["title"] == "테스트 목표"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/goals/")
    assert list_resp.status_code == 200
    goals = list_resp.json()
    assert any(g["id"] == goal_id for g in goals)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/goals/{goal_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == goal_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/goals/{goal_id}",
        json={"title": "수정된 목표", "type": "goal"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 목표"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/goals/{goal_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/goals/{goal_id}")
    assert get_deleted.status_code == 404 