"""
Task data model for the in-memory todo app.
Contains the Task class with id, title, description, and completed fields.
"""

from typing import Optional


class Task:
    """
    Represents a task in the todo application.

    Attributes:
        id: Unique identifier for the task (incremental integer starting from 1)
        title: Brief title of the task
        description: Detailed description of the task
        completed: Boolean indicating whether the task is completed
    """

    def __init__(self, id: int, title: str, description: str = "", completed: bool = False):
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed

    def __repr__(self):
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"

    def __eq__(self, other):
        if not isinstance(other, Task):
            return False
        return (self.id == other.id and
                self.title == other.title and
                self.description == other.description and
                self.completed == other.completed)