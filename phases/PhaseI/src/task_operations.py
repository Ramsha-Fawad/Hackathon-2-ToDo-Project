"""
Core operations for managing tasks in the in-memory todo app.
Provides functions for CRUD operations on tasks.
"""

from typing import List, Optional
from .task_model import Task
from .task_store import TaskStore


def create_task(store: TaskStore, title: str, description: str = "") -> Task:
    """
    Create a new task with the given title and description.

    Args:
        store: The task store to add the task to
        title: The title of the task
        description: The description of the task (optional)

    Returns:
        The created Task object
    """
    return store.add_task(title, description)


def get_task(store: TaskStore, task_id: int) -> Optional[Task]:
    """
    Retrieve a task by its ID.

    Args:
        store: The task store to search in
        task_id: The ID of the task to retrieve

    Returns:
        The Task object if found, None otherwise
    """
    return store.get_task(task_id)


def get_all_tasks(store: TaskStore) -> List[Task]:
    """
    Retrieve all tasks from the store.

    Args:
        store: The task store to retrieve tasks from

    Returns:
        List of all Task objects in the store
    """
    return store.get_all_tasks()


def update_task(
    store: TaskStore,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None
) -> Optional[Task]:
    """
    Update a task with the given parameters.

    Args:
        store: The task store containing the task
        task_id: The ID of the task to update
        title: New title for the task (optional)
        description: New description for the task (optional)
        completed: New completion status for the task (optional)

    Returns:
        The updated Task object if successful, None if task not found
    """
    return store.update_task(task_id, title, description, completed)


def delete_task(store: TaskStore, task_id: int) -> bool:
    """
    Delete a task by its ID.

    Args:
        store: The task store containing the task
        task_id: The ID of the task to delete

    Returns:
        True if the task was deleted, False if not found
    """
    return store.delete_task(task_id)


def clear_all_tasks(store: TaskStore):
    """
    Clear all tasks from the store.

    Args:
        store: The task store to clear
    """
    store.clear()