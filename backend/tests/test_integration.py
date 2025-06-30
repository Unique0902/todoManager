import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_tree_structure(async_client: AsyncClient):
    """트리 구조 생성 및 조회 테스트"""
    # 1. 목표 생성
    goal_resp = await async_client.post(
        "/api/v1/goals/",
        json={"type": "goal", "title": "테스트 목표"}
    )
    assert goal_resp.status_code == 201
    goal = goal_resp.json()
    goal_id = goal["id"]

    # 2. 프로젝트 생성 (목표 하위)
    project_resp = await async_client.post(
        "/api/v1/projects/",
        json={
            "type": "project", 
            "title": "테스트 프로젝트",
            "parent_id": goal_id,
            "parent_type": "goal"
        }
    )
    assert project_resp.status_code == 201
    project = project_resp.json()
    project_id = project["id"]

    # 3. 태스크 생성 (프로젝트 하위)
    task_resp = await async_client.post(
        "/api/v1/tasks/",
        json={
            "type": "task", 
            "title": "테스트 태스크",
            "parent_id": project_id,
            "parent_type": "project"
        }
    )
    assert task_resp.status_code == 201
    task = task_resp.json()
    task_id = task["id"]

    # 4. 트리 구조 조회
    tree_resp = await async_client.get(f"/api/v1/goals/{goal_id}/tree")
    assert tree_resp.status_code == 200
    tree = tree_resp.json()
    
    assert tree["id"] == goal_id
    assert tree["title"] == "테스트 목표"
    assert len(tree["children"]) == 1  # 프로젝트 1개
    
    project_node = tree["children"][0]
    assert project_node["id"] == project_id
    assert project_node["title"] == "테스트 프로젝트"
    assert len(project_node["children"]) == 1  # 태스크 1개
    
    task_node = project_node["children"][0]
    assert task_node["id"] == task_id
    assert task_node["title"] == "테스트 태스크"

@pytest.mark.asyncio
async def test_validation_errors(async_client: AsyncClient):
    """예외 상황 테스트"""
    # 1. 자기 자신을 부모로 지정
    goal_resp = await async_client.post(
        "/api/v1/goals/",
        json={"type": "goal", "title": "테스트 목표"}
    )
    assert goal_resp.status_code == 201
    goal = goal_resp.json()
    goal_id = goal["id"]

    # 자기 자신을 부모로 지정 시도
    self_parent_resp = await async_client.put(
        f"/api/v1/goals/{goal_id}",
        json={"parent_id": goal_id, "type": "goal"}
    )
    assert self_parent_resp.status_code == 400
    assert "자기 자신을 부모로 지정할 수 없습니다" in self_parent_resp.json()["detail"]

    # 2. 존재하지 않는 부모 지정
    invalid_parent_resp = await async_client.post(
        "/api/v1/projects/",
        json={
            "type": "project", 
            "title": "잘못된 프로젝트",
            "parent_id": 99999,
            "parent_type": "goal"
        }
    )
    assert invalid_parent_resp.status_code == 400
    assert "parent_id에 해당하는 Goal이 존재하지 않습니다" in invalid_parent_resp.json()["detail"]

    # 3. 존재하지 않는 리소스 조회
    not_found_resp = await async_client.get("/api/v1/goals/99999")
    assert not_found_resp.status_code == 404

    # 4. 잘못된 parent_type
    wrong_parent_type_resp = await async_client.post(
        "/api/v1/projects/",
        json={
            "type": "project", 
            "title": "잘못된 타입",
            "parent_type": "invalid"
        }
    )
    assert wrong_parent_type_resp.status_code == 400
    assert "parent_type은 'goal'만 허용됩니다" in wrong_parent_type_resp.json()["detail"]

@pytest.mark.asyncio
async def test_routine_performance_validation(async_client: AsyncClient):
    """루틴 성과 추적 예외 상황 테스트"""
    # 1. 루틴 생성
    routine_resp = await async_client.post(
        "/api/v1/routines/",
        json={
            "type": "routine", 
            "title": "성과 추적 테스트 루틴",
            "parent_type": "goal"
        }
    )
    assert routine_resp.status_code == 201
    routine = routine_resp.json()
    routine_id = routine["id"]

    # 2. 실패 기록 추가 (date 필드 없음)
    fail_no_date_resp = await async_client.post(
        f"/api/v1/routines/{routine_id}/fail",
        json={"reason": "테스트 실패"}
    )
    assert fail_no_date_resp.status_code == 400
    assert "date 필드는 필수입니다" in fail_no_date_resp.json()["detail"]

    # 3. 존재하지 않는 루틴에 성과 기록
    not_found_perform_resp = await async_client.post(
        "/api/v1/routines/99999/perform",
        json="2024-01-01"
    )
    assert not_found_perform_resp.status_code == 404 