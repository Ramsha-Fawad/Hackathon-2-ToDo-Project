import pytest
from sqlmodel import Session
from datetime import datetime
from ...src.services.task_service import (
    create_task, get_user_tasks, get_task_by_id,
    update_task, delete_task, toggle_task_completion
)
from ...src.models.task import TaskCreate, TaskUpdate


def test_create_task_service(db_session: Session):
    """Test task creation service function"""
    task_create = TaskCreate(
        title="Test task",
        description="Test description",
        completed=False,
        user_id="user_123"
    )

    task = create_task(db_session, task_create)

    assert task.id is not None
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.completed is False
    assert task.user_id == "user_123"
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_get_user_tasks_service(db_session: Session):
    """Test getting tasks for a specific user"""
    # Create tasks for user 1
    task_create_1 = TaskCreate(
        title="User 1 task 1",
        description="Description 1",
        completed=False,
        user_id="user_123"
    )
    create_task(db_session, task_create_1)

    task_create_2 = TaskCreate(
        title="User 1 task 2",
        description="Description 2",
        completed=True,
        user_id="user_123"
    )
    create_task(db_session, task_create_2)

    # Create task for user 2
    task_create_3 = TaskCreate(
        title="User 2 task",
        description="Description 3",
        completed=False,
        user_id="user_456"
    )
    create_task(db_session, task_create_3)

    # Get tasks for user 1
    user_1_tasks = get_user_tasks(db_session, "user_123")

    assert len(user_1_tasks) == 2
    for task in user_1_tasks:
        assert task.user_id == "user_123"

    # Get tasks for user 2
    user_2_tasks = get_user_tasks(db_session, "user_456")

    assert len(user_2_tasks) == 1
    assert user_2_tasks[0].user_id == "user_456"


def test_get_task_by_id_service(db_session: Session):
    """Test getting a specific task by ID with user validation"""
    task_create = TaskCreate(
        title="Test task",
        description="Test description",
        completed=False,
        user_id="user_123"
    )
    created_task = create_task(db_session, task_create)

    # Get the task with correct user
    retrieved_task = get_task_by_id(db_session, created_task.id, "user_123")
    assert retrieved_task is not None
    assert retrieved_task.id == created_task.id
    assert retrieved_task.title == "Test task"

    # Try to get the task with wrong user - should return None
    wrong_user_task = get_task_by_id(db_session, created_task.id, "wrong_user")
    assert wrong_user_task is None


def test_update_task_service(db_session: Session):
    """Test updating a task"""
    task_create = TaskCreate(
        title="Original task",
        description="Original description",
        completed=False,
        user_id="user_123"
    )
    created_task = create_task(db_session, task_create)

    # Update the task
    task_update = TaskUpdate(
        title="Updated task",
        description="Updated description",
        completed=True
    )
    updated_task = update_task(db_session, created_task.id, "user_123", task_update)

    assert updated_task is not None
    assert updated_task.id == created_task.id
    assert updated_task.title == "Updated task"
    assert updated_task.description == "Updated description"
    assert updated_task.completed is True
    # Check that updated_at was changed
    assert updated_task.updated_at > updated_task.created_at

    # Try to update task for wrong user - should return None
    wrong_user_updated = update_task(db_session, created_task.id, "wrong_user", task_update)
    assert wrong_user_updated is None


def test_delete_task_service(db_session: Session):
    """Test deleting a task"""
    task_create = TaskCreate(
        title="Test task to delete",
        description="Description",
        completed=False,
        user_id="user_123"
    )
    created_task = create_task(db_session, task_create)

    # Delete the task
    delete_result = delete_task(db_session, created_task.id, "user_123")
    assert delete_result is True

    # Try to get the deleted task - should return None
    retrieved_task = get_task_by_id(db_session, created_task.id, "user_123")
    assert retrieved_task is None

    # Try to delete a task that doesn't exist or belongs to different user
    non_existent_result = delete_task(db_session, 99999, "user_123")
    assert non_existent_result is False

    # Create another task and try to delete it with wrong user
    task_create_2 = TaskCreate(
        title="Another test task",
        description="Description",
        completed=False,
        user_id="user_123"
    )
    created_task_2 = create_task(db_session, task_create_2)

    wrong_user_result = delete_task(db_session, created_task_2.id, "wrong_user")
    assert wrong_user_result is False


def test_toggle_task_completion_service(db_session: Session):
    """Test toggling task completion status"""
    task_create = TaskCreate(
        title="Test task",
        description="Description",
        completed=False,
        user_id="user_123"
    )
    created_task = create_task(db_session, task_create)

    # Toggle completion to True
    toggled_task = toggle_task_completion(db_session, created_task.id, "user_123", True)
    assert toggled_task is not None
    assert toggled_task.completed is True

    # Toggle completion back to False
    toggled_task_back = toggle_task_completion(db_session, created_task.id, "user_123", False)
    assert toggled_task_back is not None
    assert toggled_task_back.completed is False

    # Try to toggle task for wrong user - should return None
    wrong_user_result = toggle_task_completion(db_session, created_task.id, "wrong_user", True)
    assert wrong_user_result is None