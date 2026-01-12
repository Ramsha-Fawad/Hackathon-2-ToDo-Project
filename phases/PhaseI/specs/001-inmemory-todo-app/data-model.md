# Data Model: Todo In-Memory Python Console Application

## Task Entity

**Description**: Represents a todo item in the application

**Fields**:
- `id`: Integer (unique, incremental, starting from 1)
- `title`: String (non-empty, required)
- `description`: String (optional, max 1000 characters)
- `completed`: Boolean (default: False)

**Validation Rules**:
- `id` must be unique and automatically assigned
- `title` must not be empty or whitespace only
- `description` length must be ≤ 1000 characters if provided
- `completed` is a boolean value representing task completion status

**State Transitions**:
- `completed` can transition from `False` to `True` (mark as complete)
- `completed` can transition from `True` to `False` (mark as incomplete)

**Relationships**:
- Task entities are stored in a TaskList collection in memory
- Each Task has a unique identifier within the TaskList

## TaskList Entity

**Description**: Collection of Task objects stored in memory

**Operations**:
- Add Task: Creates a new task with an incremented ID
- Get All Tasks: Returns all tasks in the collection
- Get Task by ID: Returns a specific task by its ID
- Update Task: Modifies a task's properties by ID
- Delete Task: Removes a task by ID
- Toggle Completion: Changes the completion status of a task by ID