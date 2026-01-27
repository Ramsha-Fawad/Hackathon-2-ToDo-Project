from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class TaskBase(SQLModel):
    """
    Base class containing common fields for Task model.
    """
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """
    Task model representing a todo task in the database.

    Fields:
    - id: Primary key, auto-generated
    - user_id: Links the task to its owner
    - title: Main content/description of the task (1-100 chars)
    - description: Additional details about the task (0-1000 chars)
    - completed: Boolean indicating completion status
    - created_at: Timestamp when the task was created
    - updated_at: Timestamp when the task was last modified
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Indexed for efficient user-based queries
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskRead(TaskBase):
    """
    Schema for reading task data (includes id and timestamps).
    """
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskUpdate(TaskBase):
    """
    Schema for updating task data (all fields are optional for partial updates).
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskCreate(TaskBase):
    """
    Schema for creating new tasks.
    """
    user_id: str  # Required for task creation to associate with user