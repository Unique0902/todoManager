import pytest
from httpx import AsyncClient
from datetime import date

@pytest.mark.asyncio
async def test_emotion_journal_crud(async_client: AsyncClient):
    # 1. 감정일기 생성
    create_resp = await async_client.post(
        "/api/v1/emotion-journals/",
        json={
            "type": "emotion_journal", 
            "content": "오늘 기분이 좋았다",
            "emotion_score": 8,
            "date": date.today().isoformat()
        }
    )
    assert create_resp.status_code == 201
    journal = create_resp.json()
    journal_id = journal["id"]
    assert journal["content"] == "오늘 기분이 좋았다"

    # 2. 전체 조회
    list_resp = await async_client.get("/api/v1/emotion-journals/")
    assert list_resp.status_code == 200
    journals = list_resp.json()
    assert any(j["id"] == journal_id for j in journals)

    # 3. 단일 조회
    get_resp = await async_client.get(f"/api/v1/emotion-journals/{journal_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == journal_id

    # 4. 수정
    update_resp = await async_client.put(
        f"/api/v1/emotion-journals/{journal_id}",
        json={"content": "수정된 감정일기", "type": "emotion_journal"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["content"] == "수정된 감정일기"

    # 5. 삭제
    delete_resp = await async_client.delete(f"/api/v1/emotion-journals/{journal_id}")
    assert delete_resp.status_code == 204

    # 6. 삭제 후 단일 조회(404)
    get_deleted = await async_client.get(f"/api/v1/emotion-journals/{journal_id}")
    assert get_deleted.status_code == 404 