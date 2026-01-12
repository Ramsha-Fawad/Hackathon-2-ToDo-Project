"""
Task manager for the in-memory todo app.
Integrates the Task model with the in-memory store.
"""

from typing import List, Optional
from .task_model import Task
from .task_store import TaskStore
from .task_operations import (
    create_task,
    get_task,
    get_all_tasks,
    update_task,
    delete_task,
    clear_all_tasks
)


class TaskManager:
    """
    Manager class that integrates Task model with TaskStore.
    Provides a unified interface for task operations.
    """

    def __init__(self):
        self.store = TaskStore()

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task."""
        return create_task(self.store, title, description)

    def get_task(self, task_id: int) -> Optional[Task]:
        """Get a task by ID."""
        return get_task(self.store, task_id)

    def get_all_tasks(self) -> List[Task]:
        """Get all tasks."""
        return get_all_tasks(self.store)

    def update_task(
        self,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        completed: Optional[bool] = None
    ) -> Optional[Task]:
        """Update a task."""
        return update_task(self.store, task_id, title, description, completed)

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID."""
        return delete_task(self.store, task_id)

    def mark_completed(self, task_id: int) -> Optional[Task]:
        """Mark a task as completed."""
        return update_task(self.store, task_id, completed=True)

    def mark_incomplete(self, task_id: int) -> Optional[Task]:
        """Mark a task as incomplete."""
        return update_task(self.store, task_id, completed=False)

    def clear_all_tasks(self):
        """Clear all tasks."""
        clear_all_tasks(self.store)


# Convenience function to create a default task manager
def get_default_task_manager() -> TaskManager:
    """Get a default instance of TaskManager."""
    return TaskManager()