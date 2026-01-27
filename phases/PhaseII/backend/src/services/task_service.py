from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from ..models.task import Task, TaskCreate, TaskUpdate


def create_task(db_session: Session, task_create: TaskCreate) -> Task:
    """
    Create a new task associated with the given user.

    Args:
        db_session: Database session
        task_create: Task creation data

    Returns:
        The created Task object
    """
    # Create a new Task instance with the provided data
    db_task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        user_id=task_create.user_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Add to session and commit
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)

    return db_task


def get_user_tasks(db_session: Session, user_id: str) -> List[Task]:
    """
    Get all tasks for a specific user.

    Args:
        db_session: Database session
        user_id: The user ID to filter tasks for

    Returns:
        List of Task objects belonging to the user
    """
    # Query tasks filtered by user_id
    statement = select(Task).where(Task.user_id == user_id)
    results = db_session.exec(statement)
    return results.all()


def get_task_by_id(db_session: Session, task_id: int, user_id: str) -> Optional[Task]:
    """
    Get a specific task by its ID, ensuring it belongs to the user.

    Args:
        db_session: Database session
        task_id: The task ID to retrieve
        user_id: The user ID to validate ownership

    Returns:
        Task object if it exists and belongs to the user, None otherwise
    """
    # Query task by ID and user_id to enforce ownership
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = db_session.exec(statement)
    return result.first()


def update_task(db_session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
    """
    Update a task, ensuring it belongs to the user.

    Args:
        db_session: Database session
        task_id: The task ID to update
        user_id: The user ID to validate ownership
        task_update: Task update data

    Returns:
        Updated Task object if successful, None if task doesn't exist or doesn't belong to user
    """
    # Get the existing task ensuring it belongs to the user
    db_task = get_task_by_id(db_session, task_id, user_id)
    if not db_task:
        return None

    # Update the task with the provided data
    task_data = task_update.dict(exclude_unset=True)

    # Apply updates only to fields that are provided
    for field, value in task_data.items():
        if hasattr(db_task, field):
            setattr(db_task, field, value)

    # Update the timestamp to reflect the modification time
    db_task.updated_at = datetime.utcnow()

    # Commit changes and refresh
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)

    return db_task


def delete_task(db_session: Session, task_id: int, user_id: str) -> bool:
    """
    Delete a task, ensuring it belongs to the user.

    Args:
        db_session: Database session
        task_id: The task ID to delete
        user_id: The user ID to validate ownership

    Returns:
        True if deletion was successful, False if task doesn't exist or doesn't belong to user
    """
    # Get the existing task ensuring it belongs to the user
    db_task = get_task_by_id(db_session, task_id, user_id)
    if not db_task:
        return False

    # Delete the task
    db_session.delete(db_task)
    db_session.commit()

    return True


def toggle_task_completion(db_session: Session, task_id: int, user_id: str, completed: bool) -> Optional[Task]:
    """
    Toggle the completion status of a task, ensuring it belongs to the user.

    Args:
        db_session: Database session
        task_id: The task ID to update
        user_id: The user ID to validate ownership
        completed: The new completion status

    Returns:
        Updated Task object if successful, None if task doesn't exist or doesn't belong to user
    """
    # Get the existing task ensuring it belongs to the user
    db_task = get_task_by_id(db_session, task_id, user_id)
    if not db_task:
        return None

    # Update the completion status
    db_task.completed = completed
    db_task.updated_at = datetime.utcnow()

    # Commit changes and refresh
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)

    return db_task