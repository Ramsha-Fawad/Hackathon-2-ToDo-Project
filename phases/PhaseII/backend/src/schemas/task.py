from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    """
    Base schema for task operations.
    """
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = False


class TaskCreate(TaskBase):
    """
    Schema for creating new tasks.
    """
    user_id: str  # Required to associate the task with a user


class TaskRead(TaskBase):
    """
    Schema for reading task data (includes id and timestamps).
    """
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskUpdate(BaseModel):
    """
    Schema for updating task data (all fields are optional for partial updates).
    """
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

    model_config = {"extra": "forbid"}  # Prevent additional fields not defined in the schema


class TaskCompleteRequest(BaseModel):
    """
    Schema for completing a task request.
    """
    completed: bool = Field(..., description="New completion status")