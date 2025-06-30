import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_project_crud(async_client: AsyncClient):
    # 1. 프로젝트 생성
    create_resp = await async_client.post(
        "/api/v1/projects/",
        json={
            "type": "project", 
            "title": "테스트 프로젝트",
            "parent_type": "goal"
        }
    )
    assert create_resp.status_code == 201
    project = create_resp.json()
    project_id = project["id"]
    assert project["title"] == "테스트 프로젝트"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/projects/")
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert any(p["id"] == project_id for p in projects)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/projects/{project_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/projects/{project_id}",
        json={"title": "수정된 프로젝트", "type": "project"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 프로젝트"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/projects/{project_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/projects/{project_id}")
    assert get_deleted.status_code == 404

@pytest.mark.asyncio
async def test_project_validation(async_client: AsyncClient):
    # 잘못된 parent_type으로 생성 시도
    create_resp = await async_client.post(
        "/api/v1/projects/",
        json={
            "type": "project", 
            "title": "잘못된 프로젝트",
            "parent_type": "invalid_type"
        }
    )
    assert create_resp.status_code == 400
    assert "parent_type은 'goal'만 허용됩니다" in create_resp.json()["detail"] 