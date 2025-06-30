import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_aspiration_crud(async_client: AsyncClient):
    # 1. 아이디어/포부 생성
    create_resp = await async_client.post(
        "/api/v1/aspirations/",
        json={
            "type": "aspiration", 
            "title": "테스트 아이디어",
            "content": "테스트 내용"
        }
    )
    assert create_resp.status_code == 201
    aspiration = create_resp.json()
    aspiration_id = aspiration["id"]
    assert aspiration["title"] == "테스트 아이디어"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/aspirations/")
    assert list_resp.status_code == 200
    aspirations = list_resp.json()
    assert any(a["id"] == aspiration_id for a in aspirations)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/aspirations/{aspiration_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == aspiration_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/aspirations/{aspiration_id}",
        json={"title": "수정된 아이디어", "type": "aspiration"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "수정된 아이디어"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/aspirations/{aspiration_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/aspirations/{aspiration_id}")
    assert get_deleted.status_code == 404 