import pytest
from sqlmodel import Session
from datetime import datetime
from ...src.models.task import Task, TaskCreate


def test_task_creation(db_session: Session):
    """Test task model creation and basic properties"""
    task = Task(
        title="Test task",
        description="Test description",
        completed=False,
        user_id="user_123"
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    assert task.id is not None
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.completed is False
    assert task.user_id == "user_123"
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_task_required_fields(db_session: Session):
    """Test that required fields are properly enforced"""
    # Test that title is required and has proper length
    with pytest.raises(Exception):  # This might raise depending on DB constraints
        task = Task(
            title="",  # Empty title should fail validation
            description="Test description",
            completed=False,
            user_id="user_123"
        )
        db_session.add(task)
        db_session.commit()


def test_task_optional_description(db_session: Session):
    """Test that description field is optional"""
    task = Task(
        title="Test task",
        description=None,  # Description is optional
        completed=False,
        user_id="user_123"
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    assert task.id is not None
    assert task.title == "Test task"
    assert task.description is None
    assert task.completed is False
    assert task.user_id == "user_123"


def test_task_default_values(db_session: Session):
    """Test that default values are properly set"""
    task = Task(
        title="Test task",
        user_id="user_123"
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    assert task.completed is False  # Default value
    assert task.description is None  # Default value
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_task_create_schema_validation():
    """Test TaskCreate schema validation"""
    # Valid creation
    task_create = TaskCreate(
        title="Valid task",
        description="Valid description",
        completed=False,
        user_id="user_123"
    )

    assert task_create.title == "Valid task"
    assert task_create.description == "Valid description"
    assert task_create.completed is False
    assert task_create.user_id == "user_123"

    # Test that title is required
    with pytest.raises(ValueError):
        TaskCreate(
            title="",  # Empty title should fail
            description="Valid description",
            completed=False,
            user_id="user_123"
        )

    # Test that title length is validated
    with pytest.raises(ValueError):
        TaskCreate(
            title="a" * 101,  # Too long title
            description="Valid description",
            completed=False,
            user_id="user_123"
        )

    # Test that description length is validated
    with pytest.raises(ValueError):
        TaskCreate(
            title="Valid task",
            description="a" * 1001,  # Too long description
            completed=False,
            user_id="user_123"
        )