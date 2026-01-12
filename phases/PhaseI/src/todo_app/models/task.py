"""
Task data model for the Todo application
"""
import re


class Task:
    """
    Represents a todo item with a unique ID, title, optional description, and completion status
    """

    def __init__(self, task_id: int, title: str, description: str = "", completed: bool = False):
        """
        Initialize a Task instance

        Args:
            task_id (int): Unique incremental integer ID for the task
            title (str): Non-empty title for the task
            description (str): Optional description (max 1000 characters)
            completed (bool): Completion status (default: False)

        Raises:
            ValueError: If title is empty or description exceeds 1000 characters
        """
        self.validate_title(title)
        self.validate_description(description)

        self.id = task_id
        self.title = title
        self.description = description
        self.completed = completed

    @staticmethod
    def validate_title(title: str) -> bool:
        """
        Validate that the title is non-empty

        Args:
            title (str): The title to validate

        Returns:
            bool: True if valid

        Raises:
            ValueError: If title is empty or only whitespace
        """
        if not title or not title.strip():
            raise ValueError("Task title must be non-empty")
        return True

    @staticmethod
    def validate_description(description: str) -> bool:
        """
        Validate that the description does not exceed 1000 characters

        Args:
            description (str): The description to validate

        Returns:
            bool: True if valid

        Raises:
            ValueError: If description exceeds 1000 characters
        """
        if len(description) > 1000:
            raise ValueError(f"Task description exceeds 1000 characters: {len(description)} provided")
        return True

    def __str__(self):
        """String representation of the task"""
        status = "[DONE]" if self.completed else "[PENDING]"
        return f"{status} ID: {self.id} | Title: {self.title} | Description: {self.description}"

    def to_dict(self):
        """Convert task to dictionary representation"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed
        }