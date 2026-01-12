# Quickstart Guide: Todo In-Memory Python Console Application

## Prerequisites
- Python 3.13+ installed
- UV package manager installed

## Setup Instructions

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies using UV:
   ```bash
   uv sync
   ```

## Running the Application

To start the todo application:
```bash
cd phases/PhaseI
python -m src.todo_app.main
```

Or alternatively:
```bash
python src/todo_app/main.py
```

## Available Features

Once the application is running, you'll see a menu with the following options:
1. Add Task - Create a new task with title and optional description
2. View Tasks - Display all tasks with their IDs and completion status
3. Update Task - Modify an existing task's title or description
4. Delete Task - Remove a task by its ID
5. Mark Task Complete/Incomplete - Toggle the completion status of a task
6. Exit - Quit the application

## Usage Examples

- When adding a task, you'll be prompted for a title (required) and description (optional)
- Task IDs are automatically assigned as incremental integers starting from 1
- Completed tasks will be visually distinguished in the task list
- Input validation ensures titles are not empty and descriptions don't exceed 1000 characters