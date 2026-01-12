# Implementation Plan: Todo In-Memory Python Console Application

**Branch**: `001-inmemory-todo-app` | **Date**: 2026-01-09 | **Spec**: [link]
**Input**: Feature specification from `phases/PhaseI/specs/001-inmemory-todo-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a command-line Todo application that stores tasks in memory using Python. The application will provide a continuous menu-driven interface allowing users to perform all five basic todo operations: add, view, update, delete, and mark tasks as complete/incomplete. The system will use incremental integer IDs for tasks, enforce input validation, and provide clear visual distinction for completed tasks.

## 1. Architecture Sketch (Phase I only)

### Core Modules and Responsibilities

**Models Layer:**
- `task.py`: Defines the Task data model with id, title, description, and completion status
- Handles validation for non-empty titles and description length limits

**Services Layer:**
- `task_service.py`: Manages business logic for task operations
  - Add task with auto-incrementing ID assignment
  - Update task details by ID
  - Delete task by ID
  - Mark task as complete/incomplete by ID
  - Retrieve all tasks or specific task by ID
  - Manage in-memory storage of tasks

**CLI Layer:**
- `menu.py`: Implements the continuous menu-driven interface
  - Displays menu options to users
  - Processes user input and routes to appropriate service methods
  - Formats and displays task lists with visual distinction for completed tasks
  - Handles input validation and error messaging

**Entry Point:**
- `main.py`: Initializes the application and starts the menu loop

### Data Flow Between Modules

1. User interacts with CLI layer through menu options
2. CLI layer validates input and calls appropriate service methods
3. Service layer performs operations on in-memory task collection
4. Service layer returns results to CLI layer
5. CLI layer formats and displays results to user

### In-Memory Task Storage Management

- Tasks stored in a Python list/dictionary within the TaskService
- Task IDs are automatically assigned as incremental integers starting from 1
- Memory management relies on Python's garbage collection
- No persistence outside of application runtime

## 2. Feature Breakdown → Execution Order

### 1. Task data model and in-memory storage
**Rationale**: Foundation layer that must exist before any operations can be performed on tasks.

### 2. Add task
**Rationale**: Core functionality that enables users to create tasks; builds upon the data model.

### 3. View task list
**Rationale**: Essential for user visibility of created tasks; needed before other operations can be verified.

### 4. Update task
**Rationale**: Allows modification of existing tasks; requires data model and basic CRUD operations.

### 5. Delete task
**Rationale**: Enables removal of tasks; requires stable data model and storage management.

### 6. Mark task complete/incomplete
**Rationale**: Core status management feature; builds on the basic data model and operations.

### 7. CLI menu loop and exit handling
**Rationale**: Final integration layer that ties all features together into a cohesive user experience; placed last to ensure all underlying functionality is complete.

## 3. Decisions Needing Documentation

### CLI Interaction Model (Menu-driven Loop)
**Chosen option**: Continuous menu-driven interface where the application stays running and presents users with options to select different operations.
**Alternative rejected**: Single-command execution or command-line arguments approach because the continuous menu approach allows users to perform multiple operations in a single session, improving user experience.

### Task ID Strategy (Incremental Integers Starting at 1)
**Chosen option**: Task IDs will be incremental integers starting from 1, automatically assigned when tasks are created.
**Alternative rejected**: UUIDs or other ID strategies because incremental integers are simpler and more user-friendly, making it easier for users to reference tasks when performing operations.

### Input Validation Rules (Non-empty Title, Description ≤ 1000 Chars)
**Chosen option**: Titles must be non-empty, and descriptions are limited to 1000 characters maximum.
**Alternative rejected**: Allowing empty titles with no description limit because the chosen approach ensures data quality while maintaining usability.

### Clean Code Rules (Module Separation, Functions ≤ 50 Lines)
**Chosen option**: Implementation will follow module separation and function size limits (functions under 50 lines).
**Alternative rejected**: Different clean code emphases because module separation with function size limits ensures maintainability and readability while keeping the code modular.

## 4. Task Decomposition Strategy

### Atomic Task Granularity
Each task will focus on a single responsibility or a small, cohesive set of related functionalities. Tasks will be designed to be individually testable and implementable by Claude Code.

### Mapping Each Feature to Concrete Implementation Tasks
- **Data Model**: Create Task class with validation methods
- **Add Task**: Implement add_task method with ID assignment logic
- **View Tasks**: Implement get_all_tasks and display formatting methods
- **Update Task**: Implement update_task method with validation
- **Delete Task**: Implement delete_task method with proper cleanup
- **Toggle Completion**: Implement mark_complete/mark_incomplete methods
- **CLI Interface**: Implement menu loop, input processing, and output formatting

### Ensuring Tasks Remain Executable by Claude Code
Tasks will be specific, well-defined, and avoid overly complex architectural decisions that require human judgment. Each task will have clear inputs, outputs, and acceptance criteria.

## 5. Testing & Validation Strategy

### Manual CLI Interaction Checks Based on Acceptance Criteria
- Verify each user story from the specification works as described
- Test happy path scenarios for all operations
- Confirm success criteria from the spec are met

### Validation Scenarios
- Happy path: Valid inputs for all operations
- Invalid input: Empty titles, descriptions exceeding limits, invalid task IDs
- Edge cases: Toggling completion status multiple times, deleting non-existent tasks

### Success Criteria Verification
- Performance: Measure response times for operations to ensure sub-second execution
- Functionality: Confirm all 5 basic todo features work correctly
- Usability: Verify the menu-driven interface is intuitive and responsive
- Validation: Confirm input validation rules are enforced as specified

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Built-in Python libraries only (sys, os, etc.)
**Storage**: In-memory only (no persistence)
**Testing**: Manual CLI interaction validation based on acceptance criteria
**Target Platform**: Cross-platform (Linux, Windows, macOS)
**Project Type**: Console application
**Performance Goals**: Sub-second response times for all operations, support 100+ tasks in memory
**Constraints**: Must follow clean code principles with module separation and functions ≤ 50 lines, CLI only interface
**Scale/Scope**: Single user console application supporting basic todo operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project requirements, the implementation adheres to the following constitutional principles:
- No external dependencies beyond Python standard library
- In-memory storage only (no database or file persistence)
- Clean, modular code structure
- CLI interface only
- All code generated via Claude Code (no manual coding)

## Project Structure

### Documentation (this feature)

```text
phases/PhaseI/specs/001-inmemory-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
phases/PhaseI/src/
├── todo_app/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py
│   ├── cli/
│   │   ├── __init__.py
│   │   └── menu.py
│   └── main.py
└── tests/
    └── manual_test_scenarios.md
```

**Structure Decision**: Single console application with modular structure separating concerns into models, services, and CLI components. This follows clean code principles with appropriate separation of concerns while keeping the implementation simple and maintainable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |