"""
In-memory task store for the todo application.
Manages tasks in memory with incremental integer IDs starting from 1.
"""

from typing import Dict, List, Optional
from .task_model import Task


class TaskStore:
    """
    In-memory storage for tasks.
    Manages tasks with incremental integer IDs starting from 1.
    """

    def __init__(self):
        self._tasks: Dict[int, Task] = {}
        self._next_id = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task with the next available ID."""
        task = Task(id=self._next_id, title=title, description=description, completed=False)
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by its ID."""
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Retrieve all tasks."""
        return list(self._tasks.values())

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None,
                   completed: Optional[bool] = None) -> Optional[Task]:
        """Update a task's properties."""
        task = self.get_task(task_id)
        if task is None:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if completed is not None:
            task.completed = completed

        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by its ID."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def clear(self):
        """Clear all tasks and reset the ID counter."""
        self._tasks.clear()
        self._next_id = 1