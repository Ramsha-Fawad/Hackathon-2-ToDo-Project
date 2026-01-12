# CLI Interface Contract: Todo In-Memory Python Console Application

## Overview
This document defines the CLI interface contract for the todo application, specifying the menu options and expected user interactions.

## Main Menu Options

When the application starts, it presents the following menu:

```
Todo Application
================
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Mark Task Complete/Incomplete
6. Exit
Choose an option (1-6):
```

## Operation Contracts

### 1. Add Task
**Input**:
- Title (required, non-empty)
- Description (optional, max 1000 characters)

**Output**:
- Success message with assigned task ID
- Error message if validation fails

**Contract**:
- System assigns next available incremental ID
- Title must pass validation (non-empty)
- Description, if provided, must be ≤ 1000 characters
- New task appears in task list with ID and pending status

### 2. View Tasks
**Input**: None
**Output**:
- Formatted list of all tasks with ID, title, description, and completion status
- Completed tasks visually distinguished

**Contract**:
- Displays all tasks in the in-memory collection
- Shows ID, title, description (truncated if > 50 chars), and completion status
- Completed tasks marked with [DONE] or strikethrough

### 3. Update Task
**Input**:
- Task ID (integer)
- New title (optional)
- New description (optional)

**Output**:
- Success message
- Error if task ID not found or validation fails

**Contract**:
- Validates that task exists
- Updates only provided fields
- Maintains ID and completion status

### 4. Delete Task
**Input**: Task ID (integer)
**Output**:
- Success confirmation
- Error if task ID not found

**Contract**:
- Removes task from in-memory collection
- Frees up the ID for potential reuse (though new tasks will continue incrementing)

### 5. Mark Task Complete/Incomplete
**Input**: Task ID (integer)
**Output**:
- Success confirmation
- Error if task ID not found

**Contract**:
- Toggles completion status of the specified task
- Updates visual representation in subsequent views

### 6. Exit
**Input**: None
**Output**: Application terminates

**Contract**:
- Gracefully closes the application
- No data is persisted (in-memory only)