---
description: "Task list for Todo In-Memory Python Console Application implementation"
---

# Tasks: Todo In-Memory Python Console Application

**Input**: Design documents from `/phases/PhaseI/specs/001-inmemory-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase I Project**: `phases/PhaseI/src/`, `phases/PhaseI/tests/` in the Phase I directory
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in phases/PhaseI/src/todo_app/
- [X] T002 Initialize Python 3.13+ project with proper directory structure
- [ ] T003 [P] Create __init__.py files in phases/PhaseI/src/todo_app/, phases/PhaseI/src/todo_app/models/, phases/PhaseI/src/todo_app/services/, phases/PhaseI/src/todo_app/cli/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create Task data model in phases/PhaseI/src/todo_app/models/task.py
- [ ] T005 Create TaskService with in-memory storage in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T006 Set up basic application entry point in phases/PhaseI/src/todo_app/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks with a title and optional description via command line

**Independent Test**: Can run the application and execute the add task command, which should store the task in memory and display confirmation.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Implement Task class with validation methods in phases/PhaseI/src/todo_app/models/task.py
- [ ] T008 [US1] Implement add_task method with ID assignment logic in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T009 [US1] Create CLI function for adding tasks in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T010 [US1] Add input validation for non-empty titles and description length limits in phases/PhaseI/src/todo_app/models/task.py
- [ ] T011 [US1] Integrate add task functionality with main menu in phases/PhaseI/src/todo_app/main.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Allow users to view all tasks with unique IDs and clear completion status indicators

**Independent Test**: Can add one or more tasks and then view the task list, which should display all tasks with their IDs and completion status.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Implement get_all_tasks method in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T013 [US2] Create CLI function for viewing tasks in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T014 [US2] Implement display formatting with ID and status indicators in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T015 [US2] Add visual distinction for completed tasks (e.g., strikethrough) in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T016 [US2] Integrate view tasks functionality with main menu in phases/PhaseI/src/todo_app/main.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Allow users to mark tasks as complete or incomplete by task ID

**Independent Test**: Can add a task, mark it as complete, and then view the task list to confirm the status has changed.

### Implementation for User Story 3

- [ ] T017 [P] [US3] Implement toggle_completion method in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T018 [US3] Create CLI function for marking tasks complete/incomplete in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T019 [US3] Add input validation to ensure task ID exists in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T020 [US3] Integrate mark task functionality with main menu in phases/PhaseI/src/todo_app/main.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Allow users to update task title and/or description by task ID

**Independent Test**: Can add a task, update its title or description, and then view the task to confirm the changes.

### Implementation for User Story 4

- [ ] T021 [P] [US4] Implement update_task method with validation in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T022 [US4] Create CLI function for updating tasks in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T023 [US4] Add input validation for updated title and description in phases/PhaseI/src/todo_app/models/task.py
- [ ] T024 [US4] Integrate update task functionality with main menu in phases/PhaseI/src/todo_app/main.py

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Allow users to delete tasks by task ID

**Independent Test**: Can add a task, delete it by its ID, and then view the task list to confirm it's no longer present.

### Implementation for User Story 5

- [ ] T025 [P] [US5] Implement delete_task method with proper cleanup in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T026 [US5] Create CLI function for deleting tasks in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T027 [US5] Add error handling for non-existent task IDs in phases/PhaseI/src/todo_app/services/task_service.py
- [ ] T028 [US5] Integrate delete task functionality with main menu in phases/PhaseI/src/todo_app/main.py

---

## Phase 8: User Story 6 - CLI Menu Loop and Exit Handling (Priority: P2)

**Goal**: Implement continuous menu-driven interface with proper exit handling

**Independent Test**: The application runs continuously, presents a menu with options, processes user input, and exits cleanly when requested.

### Implementation for User Story 6

- [ ] T029 [P] [US6] Implement continuous menu loop in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T030 [US6] Add proper exit handling in phases/PhaseI/src/todo_app/main.py
- [ ] T031 [US6] Create clear menu display with numbered options in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T032 [US6] Implement error handling for invalid menu selections in phases/PhaseI/src/todo_app/cli/menu.py
- [ ] T033 [US6] Integrate all user stories into cohesive menu system in phases/PhaseI/src/todo_app/main.py

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Add comprehensive error messages when invalid operations are attempted
- [ ] T035 [P] Improve input validation and user feedback across all functions
- [ ] T036 Add documentation strings to all functions and classes
- [ ] T037 [P] Ensure functions follow clean code rules (≤ 50 lines)
- [ ] T038 Run quickstart validation to ensure all acceptance criteria are met
- [ ] T039 Update README in phases/PhaseI/ with instructions for running the application

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Integrates all previous stories into cohesive interface

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- Each story should be independently testable before integration

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Implement Task class with validation methods in phases/PhaseI/src/todo_app/models/task.py"
Task: "Implement add_task method with ID assignment logic in phases/PhaseI/src/todo_app/services/task_service.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
   - Developer F: User Story 6
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence