# Implementation Tasks: Phase II Backend – Todo API Service

**Feature**: Phase II Backend – Todo API Service
**Branch**: 001-fastapi-backend
**Generated**: 2026-01-23
**Based on**: specs/001-fastapi-backend/spec.md, plan.md, data-model.md, contracts/openapi.yaml

## Overview

This document breaks down the implementation of the Phase II Backend Todo API Service into atomic, executable tasks. Tasks are organized by dependency and grouped by user story priority to enable incremental development and testing.

## Dependencies & Execution Order

- **User Story 1 (P1)**: Secure Task Management Access - Foundation for all other functionality
- **User Story 2 (P1)**: Task Lifecycle Management - Builds on User Story 1
- **User Story 3 (P2)**: Secure API Access Control - Validates security of all other stories

## Parallel Execution Opportunities

- Database layer tasks can run in parallel with authentication setup
- Schema definitions can run in parallel with model definitions
- Service layer tasks can run in parallel with router setup
- Test tasks can be developed alongside implementation

---

## Phase 1: Project Setup & Configuration

### Goal
Establish foundational project structure and configuration for the backend service.

### Independent Test Criteria
- Project structure matches plan.md specifications
- Dependencies can be installed successfully
- Application starts without errors
- Environment variables are properly configured

### Tasks

- [x] T001 Create project directory structure under phases/PhaseII/backend/src/
- [x] T002 [P] Create requirements.txt with FastAPI, SQLModel, PyJWT, python-multipart, uvicorn, psycopg2-binary
- [x] T003 [P] Create requirements-dev.txt with pytest, httpx, pytest-asyncio for testing
- [x] T004 [P] Create main.py application entry point with basic FastAPI app
- [x] T005 [P] Create config/settings.py for environment variable management
- [x] T006 Set up basic project files and folders per plan architecture

---

## Phase 2: Database Layer (Neon + SQLModel)

### Goal
Implement database connectivity and model definitions for task persistence.

### Independent Test Criteria
- Database connection can be established
- Task model can be created and queried
- User isolation is enforced at query level
- Tables are created successfully

### Tasks

- [x] T007 [P] Create database/engine.py for SQLModel engine configuration
- [x] T008 [P] Create database/session.py for session dependency management
- [x] T009 [P] Create models/base.py for SQLModel base configuration
- [x] T010 [P] Create models/task.py with Task model definition per data-model.md
- [x] T011 [P] Create database initialization logic with proper connection pooling
- [x] T012 [P] Implement database session dependency for FastAPI

---

## Phase 3: Authentication & Authorization

### Goal
Implement JWT-based authentication and user isolation enforcement.

### Independent Test Criteria
- JWT tokens can be verified successfully
- User ID extraction from JWT claims works correctly
- URL user ID validation against JWT user ID functions properly
- Unauthorized requests return 401 status

### Tasks

- [x] T013 [P] Create utils/auth.py for JWT utility functions
- [x] T014 [P] Implement JWT verification with HS256 algorithm
- [x] T015 [P] Create api/deps.py with authentication dependency
- [x] T016 [P] Implement user_id extraction from JWT claims
- [x] T017 [P] Create authorization guard to validate URL user_id vs JWT user_id
- [x] T018 [P] Configure BETTER_AUTH_SECRET environment variable handling

---

## Phase 4: [US1] Core Business Logic (Services)

### Goal
Implement task service layer with CRUD operations and ownership enforcement for User Story 1.

### User Story Focus: Secure Task Management Access (P1)
A registered user accesses the todo application and performs CRUD operations on their tasks through the backend API. The user expects that their tasks are isolated from other users and that all operations require proper authentication.

### Independent Test Criteria
- Users can create tasks associated with their user ID
- Users can retrieve only their own tasks
- Users cannot access other users' tasks
- All operations require proper authentication

### Tasks

- [x] T019 [P] Create services/task_service.py for task business logic
- [x] T020 [P] [US1] Implement create_task function with user_id assignment
- [x] T021 [P] [US1] Implement get_user_tasks function with user_id filtering
- [x] T022 [P] [US1] Implement get_task_by_id function with ownership validation
- [x] T023 [P] [US1] Implement update_task function with ownership validation
- [x] T024 [P] [US1] Implement delete_task function with ownership validation
- [x] T025 [P] [US1] Implement task completion toggle function with ownership validation

---

## Phase 5: [US1] API Routers

### Goal
Implement API endpoints for task management per API contract for User Story 1.

### User Story Focus: Secure Task Management Access (P1)

### Independent Test Criteria
- All API endpoints return correct HTTP status codes
- Authentication is enforced on all endpoints
- User isolation is maintained at API level
- Request/response schemas match contracts

### Tasks

- [x] T026 [P] [US1] Create api/v1/__init__.py for versioned API
- [x] T027 [P] [US1] Create api/v1/tasks.py with task endpoints
- [x] T028 [P] [US1] Implement GET /api/{user_id}/tasks endpoint
- [x] T029 [P] [US1] Implement POST /api/{user_id}/tasks endpoint
- [x] T030 [P] [US1] Implement GET /api/{user_id}/tasks/{id} endpoint
- [x] T031 [P] [US1] Implement PUT /api/{user_id}/tasks/{id} endpoint
- [x] T032 [P] [US1] Implement DELETE /api/{user_id}/tasks/{id} endpoint
- [x] T033 [P] [US1] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint
- [x] T034 [P] [US1] Create schemas/task.py with Pydantic models
- [x] T035 [P] [US1] Create schemas/auth.py with authentication schemas

---

## Phase 6: [US2] Task Lifecycle Management

### Goal
Enhance task management functionality to support full lifecycle operations for User Story 2.

### User Story Focus: Task Lifecycle Management (P1)
A user manages the complete lifecycle of their tasks, including creating, viewing, updating, completing, and deleting tasks. The user expects that all operations are persisted reliably and reflect the current state of their tasks.

### Independent Test Criteria
- Users can update task properties and changes are persisted
- Task completion status can be toggled and saved
- All lifecycle operations maintain data consistency
- Timestamps are updated appropriately on modifications

### Tasks

- [x] T036 [P] [US2] Enhance task service to handle property updates correctly
- [x] T037 [P] [US2] Implement proper timestamp handling (created_at, updated_at)
- [x] T038 [P] [US2] Add validation for task title/description length limits
- [x] T039 [P] [US2] Ensure completion status updates work properly
- [x] T040 [P] [US2] Test full task lifecycle: create → update → complete → delete

---

## Phase 7: [US3] API Security & Access Control

### Goal
Implement comprehensive security measures and error handling for User Story 3.

### User Story Focus: Secure API Access Control (P2)
An unauthenticated user or a user with invalid credentials attempts to access the API. The system should reject unauthorized requests and enforce proper authentication and authorization protocols.

### Independent Test Criteria
- Unauthenticated requests return 401 Unauthorized
- Mismatched user IDs return 403 Forbidden
- Expired/invalid tokens return 401 Unauthorized
- Malformed requests return appropriate error responses

### Tasks

- [x] T041 [P] [US3] Create utils/validators.py for input validation
- [x] T042 [P] [US3] Implement custom exception classes for API errors
- [x] T043 [P] [US3] Add global exception handlers for consistent error responses
- [x] T044 [P] [US3] Validate JWT expiration and clock skew (15 min expiry, 5 min skew)
- [x] T045 [P] [US3] Test unauthorized access scenarios return 401
- [x] T046 [P] [US3] Test user ID mismatch scenarios return 403
- [x] T047 [P] [US3] Test expired token scenarios return 401

---

## Phase 8: Error Handling & Validation

### Goal
Implement comprehensive error handling and input validation across all components.

### Independent Test Criteria
- All validation rules are enforced (title: 1-100 chars, description: 0-1000 chars)
- Error responses follow JSON format with message and error code
- Appropriate HTTP status codes are returned for all scenarios
- Validation errors return 422 status with details

### Tasks

- [x] T048 [P] Add input validation to task creation endpoint
- [x] T049 [P] Add input validation to task update endpoint
- [x] T050 [P] Implement consistent error response format (JSON with message and code)
- [x] T051 [P] Add validation for empty task titles (return 422)
- [x] T052 [P] Add validation for title length (1-100 characters)
- [x] T053 [P] Add validation for description length (0-1000 characters)
- [x] T054 [P] Ensure all error responses follow the same structure

---

## Phase 9: OpenAPI & Documentation

### Goal
Configure OpenAPI documentation to reflect security requirements and endpoint contracts.

### Independent Test Criteria
- OpenAPI documentation shows JWT security requirements
- All endpoints are documented with proper parameters and responses
- Example requests/responses are available in documentation
- Security schemes are properly configured

### Tasks

- [x] T055 [P] Configure JWT bearer token security scheme in FastAPI
- [x] T056 [P] Add proper OpenAPI documentation for all endpoints
- [x] T057 [P] Include example requests and responses in documentation
- [x] T058 [P] Ensure security requirements are visible in API docs

---

## Phase 10: [US1] Testing & Verification

### Goal
Create tests for User Story 1 functionality to ensure requirements are met.

### User Story Focus: Secure Task Management Access (P1)

### Independent Test Criteria
- All CRUD operations work for authenticated users
- User isolation is enforced (users can't access other users' tasks)
- Authentication is required for all operations
- Tests pass consistently

### Tasks

- [x] T059 [P] [US1] Create tests/conftest.py with pytest fixtures
- [x] T060 [P] [US1] Create tests/test_api/test_tasks.py for endpoint tests
- [x] T061 [P] [US1] Create tests/test_models/test_task.py for model tests
- [x] T062 [P] [US1] Create tests/test_services/test_task_service.py for service tests
- [x] T063 [P] [US1] Test scenario: Given authenticated user, When create task, Then task associated with user ID
- [x] T064 [P] [US1] Test scenario: Given authenticated user, When get tasks, Then only user's tasks returned
- [x] T065 [P] [US1] Test scenario: Given authenticated user, When access other user's tasks, Then 403 Forbidden returned

---

## Phase 11: [US2] Testing & Verification

### Goal
Create tests for User Story 2 functionality to ensure lifecycle management works.

### User Story Focus: Task Lifecycle Management (P1)

### Independent Test Criteria
- Full task lifecycle operations work correctly
- Updates are persisted properly
- Completion status updates work
- All operations maintain data integrity

### Tasks

- [x] T066 [P] [US2] Test scenario: Given user with tasks, When update task properties, Then changes saved and reflected
- [x] T067 [P] [US2] Test scenario: Given user with incomplete tasks, When mark complete, Then status updated to completed
- [x] T068 [P] [US2] Test scenario: Given user with completed tasks, When get tasks, Then completion status accurate
- [x] T069 [P] [US2] Test full lifecycle: create → read → update → complete → delete

---

## Phase 12: [US3] Testing & Verification

### Goal
Create security tests for User Story 3 to ensure access control works.

### User Story Focus: Secure API Access Control (P2)

### Independent Test Criteria
- Unauthorized requests return 401
- Invalid credentials return appropriate errors
- User ID mismatches return 403
- Security measures are effective

### Tasks

- [x] T070 [P] [US3] Test scenario: Given request without auth, When access endpoint, Then 401 Unauthorized returned
- [x] T071 [P] [US3] Test scenario: Given valid JWT with mismatched user ID, When access endpoint, Then 403 Forbidden returned
- [x] T072 [P] [US3] Test scenario: Given expired JWT, When access endpoint, Then 401 Unauthorized returned
- [x] T073 [P] [US3] Test malformed JWT handling returns 401

---

## Phase 13: Edge Case Testing

### Goal
Test edge cases and error scenarios to ensure robustness.

### Independent Test Criteria
- Non-existent task IDs return 404
- Malformed JWT tokens return 401
- Empty titles return 422
- Concurrent modification scenarios handled properly

### Tasks

- [x] T074 [P] Test accessing non-existent task ID returns 404
- [x] T075 [P] Test malformed JWT tokens return 401
- [x] T076 [P] Test creating task with empty title returns 422
- [x] T077 [P] Document approach for handling concurrent modifications

---

## Phase 14: Readiness & Handoff

### Goal
Prepare the backend for integration and deployment.

### Independent Test Criteria
- Backend can be started successfully
- All endpoints function as expected
- Environment variables are documented
- Integration notes are provided

### Tasks

- [x] T078 [P] Create run instructions in quickstart guide
- [x] T079 [P] Document required environment variables
- [x] T080 [P] Create integration notes for frontend connection
- [x] T081 [P] Verify all endpoints match API contract from contracts/openapi.yaml
- [x] T082 [P] Run complete test suite to ensure all functionality works
- [x] T083 [P] Verify security requirements are met (user isolation, auth enforcement)

---

## Implementation Strategy

### MVP Scope (Tasks T001-T035)
Focus on User Story 1 (Secure Task Management Access) to deliver core functionality:
- Basic project structure
- Database connectivity and Task model
- JWT authentication
- Task CRUD endpoints
- User isolation enforcement

### Incremental Delivery
- **Iteration 1**: MVP with create/get tasks functionality
- **Iteration 2**: Add update/delete functionality
- **Iteration 3**: Add completion toggle functionality
- **Iteration 4**: Add security measures and error handling
- **Iteration 5**: Add comprehensive testing

### Success Metrics
- All acceptance scenarios from user stories pass
- Security requirements are enforced (no cross-user access)
- Performance meets sub-500ms response time goal
- All API endpoints return correct status codes
- Proper error handling and validation in place