from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session
from ...database.session import get_session
from ...services.task_service import (
    create_task, get_user_tasks, get_task_by_id,
    update_task, delete_task, toggle_task_completion
)
from ...schemas.task import TaskCreate, TaskRead, TaskUpdate, TaskCompleteRequest
from .auth import validate_user_id

router = APIRouter(prefix="/api/{user_id}", tags=["tasks"])


@router.get("/tasks", response_model=List[TaskRead], status_code=status.HTTP_200_OK)
def get_tasks(
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Get all tasks for a specific user.

    Args:
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Returns:
        List of tasks belonging to the user
    """
    tasks = get_user_tasks(db_session, user_id)
    return tasks


@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_create: TaskCreate,
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_create: Task creation data
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Returns:
        The created task
    """
    # Ensure the task is associated with the correct user
    if task_create.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create task for different user"
        )

    task = create_task(db_session, task_create)
    return task


@router.get("/tasks/{id}", response_model=TaskRead, status_code=status.HTTP_200_OK)
def get_task(
    id: int,
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Get a specific task by its ID.

    Args:
        id: The task ID
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Returns:
        The requested task

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    task = get_task_by_id(db_session, id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/tasks/{id}", response_model=TaskRead, status_code=status.HTTP_200_OK)
def update_existing_task(
    id: int,
    task_update: TaskUpdate,
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Update a specific task by its ID.

    Args:
        id: The task ID
        task_update: Task update data
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Returns:
        The updated task

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    task = update_task(db_session, id, user_id, task_update)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(
    id: int,
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Delete a specific task by its ID.

    Args:
        id: The task ID
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    success = delete_task(db_session, id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # Return 204 No Content on successful deletion


@router.patch("/tasks/{id}/complete", response_model=TaskRead, status_code=status.HTTP_200_OK)
def toggle_task_complete(
    id: int,
    task_complete_request: TaskCompleteRequest,
    user_id: str = Depends(validate_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task.

    Args:
        id: The task ID
        task_complete_request: Request containing the new completion status
        user_id: The user ID from the path (validated via dependency)
        db_session: Database session

    Returns:
        The updated task with new completion status

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    task = toggle_task_completion(db_session, id, user_id, task_complete_request.completed)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task