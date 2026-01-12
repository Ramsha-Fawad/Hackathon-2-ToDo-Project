"""
Task service for the Todo application
Manages business logic for task operations using in-memory storage
"""
from typing import List, Optional
from ..models.task import Task


class TaskService:
    """
    Service class that manages business logic for task operations
    Uses in-memory storage to store tasks
    """

    def __init__(self):
        """Initialize the task service with an empty in-memory storage"""
        self._tasks: List[Task] = []
        self._next_id = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Add a new task with auto-incrementing ID assignment

        Args:
            title (str): Non-empty title for the task
            description (str): Optional description (max 1000 characters)

        Returns:
            Task: The created task instance

        Raises:
            ValueError: If title is empty or description exceeds 1000 characters
        """
        task = Task(self._next_id, title, description, False)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks in the collection

        Returns:
            List[Task]: List of all tasks
        """
        return self._tasks.copy()

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a specific task by its ID

        Args:
            task_id (int): The ID of the task to retrieve

        Returns:
            Optional[Task]: The task if found, None otherwise
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, title: str = None, description: str = None) -> Optional[Task]:
        """
        Update an existing task's details by ID

        Args:
            task_id (int): The ID of the task to update
            title (str, optional): New title (if provided)
            description (str, optional): New description (if provided)

        Returns:
            Optional[Task]: The updated task if found, None otherwise

        Raises:
            ValueError: If new title is empty or description exceeds 1000 characters
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        # Validate new values if provided
        if title is not None:
            Task.validate_title(title)
            task.title = title
        if description is not None:
            Task.validate_description(description)
            task.description = description

        return task

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID

        Args:
            task_id (int): The ID of the task to delete

        Returns:
            bool: True if task was deleted, False if not found
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        self._tasks.remove(task)
        return True

    def mark_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete by its ID

        Args:
            task_id (int): The ID of the task to mark as complete

        Returns:
            bool: True if task was marked complete, False if not found
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        task.completed = True
        return True

    def mark_incomplete(self, task_id: int) -> bool:
        """
        Mark a task as incomplete by its ID

        Args:
            task_id (int): The ID of the task to mark as incomplete

        Returns:
            bool: True if task was marked incomplete, False if not found
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        task.completed = False
        return True

    def toggle_completion(self, task_id: int) -> Optional[bool]:
        """
        Toggle the completion status of a task by its ID

        Args:
            task_id (int): The ID of the task to toggle

        Returns:
            Optional[bool]: New completion status if task was found, None if not found
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.completed = not task.completed
        return task.completed

    def get_next_id(self) -> int:
        """
        Get the next available task ID

        Returns:
            int: The next available ID
        """
        return self._next_id

    def format_tasks_list(self) -> str:
        """
        Format all tasks for display with ID, title, and completion status ([ ] / [x])

        Returns:
            str: Formatted string representation of all tasks
        """
        tasks = self.get_all_tasks()
        if not tasks:
            return "No tasks found."

        formatted_lines = [f"Task List ({len(tasks)} tasks):"]
        for task in tasks:
            status = "[x]" if task.completed else "[ ]"
            formatted_line = f"ID: {task.id} | {status} | {task.title}"
            formatted_lines.append(formatted_line)

        return "\n".join(formatted_lines)