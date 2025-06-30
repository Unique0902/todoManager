import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_milestone_group_crud(async_client: AsyncClient):
    # 1. 마일스톤 그룹 생성
    create_resp = await async_client.post(
        "/api/v1/milestone-groups/",
        json={
            "type": "milestone_group", 
            "title": "테스트 마일스톤 그룹",
            "parent_type": "project"
        }
    )
    assert create_resp.status_code == 201
    milestone_group = create_resp.json()
    group_id = milestone_group["id"]
    assert milestone_group["title"] == "테스트 마일스톤 그룹"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/milestone-groups/")
    assert list_resp.status_code == 200
    milestone_groups = list_resp.json()
    assert any(mg["id"] == group_id for mg in milestone_groups)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/milestone-groups/{group_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == group_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/milestone-groups/{group_id}",
        json={"title": "수정된 마일스톤 그룹", "type": "milestone_group"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 마일스톤 그룹"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/milestone-groups/{group_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/milestone-groups/{group_id}")
    assert get_deleted.status_code == 404

@pytest.mark.asyncio
async def test_milestone_group_validation(async_client: AsyncClient):
    # 잘못된 parent_type으로 생성 시도
    create_resp = await async_client.post(
        "/api/v1/milestone-groups/",
        json={
            "type": "milestone_group", 
            "title": "잘못된 마일스톤 그룹",
            "parent_type": "invalid_type"
        }
    )
    assert create_resp.status_code == 400
    assert "parent_type은 'project'만 허용됩니다" in create_resp.json()["detail"] 