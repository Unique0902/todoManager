import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_other_task_crud(async_client: AsyncClient):
    # 1. 기타 할일 생성
    create_resp = await async_client.post(
        "/api/v1/other-tasks/",
        json={
            "type": "other_task", 
            "title": "테스트 기타 할일",
            "parent_type": "goal"
        }
    )
    assert create_resp.status_code == 201
    other_task = create_resp.json()
    other_task_id = other_task["id"]
    assert other_task["title"] == "테스트 기타 할일"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/other-tasks/")
    assert list_resp.status_code == 200
    other_tasks = list_resp.json()
    assert any(ot["id"] == other_task_id for ot in other_tasks)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/other-tasks/{other_task_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == other_task_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/other-tasks/{other_task_id}",
        json={"title": "수정된 기타 할일", "type": "other_task"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 기타 할일"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/other-tasks/{other_task_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/other-tasks/{other_task_id}")
    assert get_deleted.status_code == 404

@pytest.mark.asyncio
async def test_other_task_validation(async_client: AsyncClient):
    # 잘못된 parent_type으로 생성 시도
    create_resp = await async_client.post(
        "/api/v1/other-tasks/",
        json={
            "type": "other_task", 
            "title": "잘못된 기타 할일",
            "parent_type": "invalid_type"
        }
    )
    assert create_resp.status_code == 400
    assert "parent_type은 'goal', 'project'만 허용됩니다" in create_resp.json()["detail"] 