import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from ..conftest import valid_token, different_user_token, expired_token


def test_create_task_success(client: TestClient, valid_token: str):
    """Test scenario: Given authenticated user, When create task, Then task associated with user ID"""
    headers = {"Authorization": f"Bearer {valid_token}"}

    response = client.post(
        "/api/user_123_test/tasks",
        json={"title": "Test task", "description": "Test description"},
        headers=headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"
    assert data["description"] == "Test description"
    assert data["user_id"] == "user_123_test"
    assert data["completed"] is False


def test_get_tasks_success(client: TestClient, valid_token: str):
    """Test scenario: Given authenticated user, When get tasks, Then only user's tasks returned"""
    headers = {"Authorization": f"Bearer {valid_token}"}

    # Create a task first
    client.post(
        "/api/user_123_test/tasks",
        json={"title": "Test task", "description": "Test description"},
        headers=headers
    )

    # Get tasks
    response = client.get("/api/user_123_test/tasks", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    # All tasks should belong to the requesting user
    for task in data:
        assert task["user_id"] == "user_123_test"


def test_access_other_users_tasks_forbidden(client: TestClient, valid_token: str, different_user_token: str):
    """Test scenario: Given authenticated user, When access other user's tasks, Then 403 Forbidden returned"""
    # Use the different user token to create a task
    headers_diff = {"Authorization": f"Bearer {different_user_token}"}

    response_create = client.post(
        "/api/different_user_456/tasks",
        json={"title": "Other user task", "description": "Other user description"},
        headers=headers_diff
    )
    assert response_create.status_code == 201

    # Try to access other user's tasks with current user's token
    headers_current = {"Authorization": f"Bearer {valid_token}"}
    response = client.get("/api/different_user_456/tasks", headers=headers_current)

    assert response.status_code == 403


def test_unauthorized_access_returns_401(client: TestClient):
    """Test scenario: Given request without auth, When access endpoint, Then 401 Unauthorized returned"""
    response = client.get("/api/user_123_test/tasks")
    assert response.status_code == 401


def test_expired_token_returns_401(client: TestClient, expired_token: str):
    """Test scenario: Given expired JWT, When access endpoint, Then 401 Unauthorized returned"""
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/user_123_test/tasks", headers=headers)
    assert response.status_code == 401


def test_mismatched_user_id_returns_403(client: TestClient, valid_token: str):
    """Test scenario: Given valid JWT with mismatched user ID, When access endpoint, Then 403 Forbidden returned"""
    headers = {"Authorization": f"Bearer {valid_token}"}
    # Try to access different user's tasks with valid token for different user
    response = client.get("/api/different_user/tasks", headers=headers)
    assert response.status_code == 403


def test_create_task_empty_title_returns_422(client: TestClient, valid_token: str):
    """Test scenario: Given creating task with empty title, When submit, Then 422 returned"""
    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.post(
        "/api/user_123_test/tasks",
        json={"title": "", "description": "Test description"},
        headers=headers
    )
    assert response.status_code == 422


def test_create_task_missing_title_returns_422(client: TestClient, valid_token: str):
    """Test scenario: Given creating task without title, When submit, Then 422 returned"""
    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.post(
        "/api/user_123_test/tasks",
        json={"description": "Test description"},  # Missing title
        headers=headers
    )
    assert response.status_code == 422


def test_get_nonexistent_task_returns_404(client: TestClient, valid_token: str):
    """Test scenario: Given accessing non-existent task ID, When request, Then 404 returned"""
    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.get("/api/user_123_test/tasks/99999", headers=headers)
    assert response.status_code == 404


def test_update_task_success(client: TestClient, valid_token: str):
    """Test scenario: Given user with tasks, When update task properties, Then changes saved and reflected"""
    headers = {"Authorization": f"Bearer {valid_token}"}

    # Create a task first
    create_response = client.post(
        "/api/user_123_test/tasks",
        json={"title": "Original task", "description": "Original description"},
        headers=headers
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Update the task
    update_response = client.put(
        f"/api/user_123_test/tasks/{task_id}",
        json={"title": "Updated task", "description": "Updated description"},
        headers=headers
    )

    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated task"
    assert data["description"] == "Updated description"


def test_toggle_task_completion(client: TestClient, valid_token: str):
    """Test scenario: Given user with incomplete tasks, When mark complete, Then status updated to completed"""
    headers = {"Authorization": f"Bearer {valid_token}"}

    # Create a task first
    create_response = client.post(
        "/api/user_123_test/tasks",
        json={"title": "Test task", "description": "Test description"},
        headers=headers
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Toggle completion status
    toggle_response = client.patch(
        f"/api/user_123_test/tasks/{task_id}/complete",
        json={"completed": True},
        headers=headers
    )

    assert toggle_response.status_code == 200
    data = toggle_response.json()
    assert data["completed"] is True


def test_full_lifecycle(client: TestClient, valid_token: str):
    """Test scenario: Full lifecycle: create → read → update → complete → delete"""
    headers = {"Authorization": f"Bearer {valid_token}"}

    # 1. Create task
    create_response = client.post(
        "/api/user_123_test/tasks",
        json={"title": "Lifecycle test", "description": "Test lifecycle"},
        headers=headers
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # 2. Read task
    get_response = client.get(f"/api/user_123_test/tasks/{task_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Lifecycle test"

    # 3. Update task
    update_response = client.put(
        f"/api/user_123_test/tasks/{task_id}",
        json={"title": "Updated lifecycle test"},
        headers=headers
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated lifecycle test"

    # 4. Complete task
    complete_response = client.patch(
        f"/api/user_123_test/tasks/{task_id}/complete",
        json={"completed": True},
        headers=headers
    )
    assert complete_response.status_code == 200
    assert complete_response.json()["completed"] is True

    # 5. Delete task
    delete_response = client.delete(f"/api/user_123_test/tasks/{task_id}", headers=headers)
    assert delete_response.status_code == 204

    # 6. Verify task is gone
    get_deleted_response = client.get(f"/api/user_123_test/tasks/{task_id}", headers=headers)
    assert get_deleted_response.status_code == 404