# Feature Specification: Phase II Backend – Todo API Service

**Feature Branch**: `001-fastapi-backend`
**Created**: 2026-01-23
**Status**: Draft
**Input**: User description: "Phase II Backend – Todo API Service (Monorepo, Authenticated, Persistent)

Context:
This specification is for Phase II (Backend) of the 'Evolution of Todo' project.
Phase I (CLI) and Phase II Frontend already exist.
This work MUST be scoped strictly to the backend service.

Monorepo location (STRICT):
- ALL backend specs MUST live under:
  phases/PhaseII/backend/specs/
- ALL backend source code MUST live under:
  phases/PhaseII/backend/src/
- DO NOT create or modify files outside phases/PhaseII/backend
- DO NOT write anything in root-level /specs or other phases

Objective:
Design and implement a production-ready backend that provides a secure, authenticated API for a multi-user Todo application with persistent storage.

Target audience:
- Developers reviewing spec-driven, agentic backend design
- Judges evaluating correctness, security, and architecture quality

Core responsibilities:
- Expose RESTful CRUD endpoints for Todo tasks
- Enforce per-user data isolation
- Persist data using cloud database service
- Authenticate requests using tokens issued by Better Auth (frontend)

Authentication model:
- Frontend uses authentication system to issue tokens
- Backend validates tokens using shared secret
- Token is provided via Authorization header
- Backend extracts user_id from token claims
- ALL data access MUST be filtered by authenticated user_id
- Requests without valid token MUST return 401

API contract (REQUIRED):
Base path: /api

Endpoints:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Rules:
- user_id in URL MUST match user_id in token, otherwise 403
- Task ownership enforced on every operation
- No cross-user access under any circumstances

Data model (high-level):
- User (external, represented by token claims)
- Task:
  - id (int, PK)
  - user_id (string, indexed)
  - title (non-empty)
  - description (optional)
  - completed (boolean)
  - created_at
  - updated_at

Success criteria:
- All endpoints functional and secured
- Token validation implemented
- Tasks persist correctly in database
- User isolation enforced at query level
- API schema accurately reflects auth requirements
- Backend can run independently of frontend
- Backend is ready for containerization in Phase IV

Constraints:
- NO frontend code
- NO UI logic
- NO manual SQL
- NO global state
- NO root-level file creation
- NO skipping spec → plan → tasks → implement steps

Clean code expectations:
- Modular structure (routers, models, services, auth)
- Clear separation of concerns
- Functions small and testable
- Explicit error handling

Reusable intelligence (MUST USE):
- .claude/agents:
  - fastapi-backend-expert
  - database-expert
  - auth-expert
- .claude/skills:
  - auth-skill
  - persistence-skill
  - validation-skill
  - task-skill
  - apicontract

Out of scope (NOT building):
- Frontend UI
- Chatbot features
- Background jobs
- Kafka, Dapr, Kubernetes (later phases)
- Role-based access control (admin, etc.)

Timeline:
- Phase II Backend only
- Must be ready for frontend integration and Phase IV containerization

Output expectation:
- A complete, unambiguous backend specification suitable for /sp.plan
- Explicit assumptions documented
- No implementation yet"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Management Access (Priority: P1)

A registered user accesses the todo application and performs CRUD operations on their tasks through the backend API. The user expects that their tasks are isolated from other users and that all operations require proper authentication.

**Why this priority**: This is the core functionality of the todo application and forms the foundation for all other features. Without secure task management, the application cannot function as intended.

**Independent Test**: The system can be fully tested by creating a user, authenticating them with a JWT, and verifying they can perform all CRUD operations on their own tasks while being prevented from accessing other users' tasks. This delivers the core value of the application - secure personal task management.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT, **When** the user makes a request to create a task, **Then** the task is created and associated with the user's ID
2. **Given** a user is authenticated with a valid JWT, **When** the user makes a request to view their tasks, **Then** only tasks belonging to that user are returned
3. **Given** a user is authenticated with a valid JWT, **When** the user attempts to access another user's tasks, **Then** the system returns a 403 Forbidden response

---

### User Story 2 - Task Lifecycle Management (Priority: P1)

A user manages the complete lifecycle of their tasks, including creating, viewing, updating, completing, and deleting tasks. The user expects that all operations are persisted reliably and reflect the current state of their tasks.

**Why this priority**: This covers the complete CRUD functionality that users need to interact with their tasks effectively. It's essential for the practical utility of the todo application.

**Independent Test**: The system can be tested by performing the full lifecycle of a task - create, read, update (including marking as complete), and delete - while ensuring all changes are persisted correctly. This delivers the complete task management experience.

**Acceptance Scenarios**:

1. **Given** a user has created tasks, **When** the user updates a task's properties, **Then** the changes are saved and reflected when retrieving the task
2. **Given** a user has incomplete tasks, **When** the user marks a task as complete, **Then** the task's status is updated to completed
3. **Given** a user has completed tasks, **When** the user retrieves their tasks, **Then** the completion status is accurately reflected

---

### User Story 3 - Secure API Access Control (Priority: P2)

An unauthenticated user or a user with invalid credentials attempts to access the API. The system should reject unauthorized requests and enforce proper authentication and authorization protocols.

**Why this priority**: Security is critical for protecting user data and maintaining privacy. Without proper access controls, the application is vulnerable to unauthorized access and data breaches.

**Independent Test**: The system can be tested by making requests without authentication tokens, with invalid tokens, and with mismatched user IDs, verifying that appropriate error responses (401, 403) are returned. This delivers the security assurance needed for a production system.

**Acceptance Scenarios**:

1. **Given** a request without authentication, **When** the request is made to any API endpoint, **Then** the system returns a 401 Unauthorized response
2. **Given** a request with a valid JWT but mismatched user ID in the URL, **When** the request is made to an endpoint, **Then** the system returns a 403 Forbidden response
3. **Given** a request with an expired JWT, **When** the request is made to any endpoint, **Then** the system returns a 401 Unauthorized response

---

### Edge Cases

- What happens when a user attempts to access a task ID that doesn't exist? The system should return a 404 Not Found response.
- How does the system handle requests with malformed JWT tokens? The system should return a 401 Unauthorized response.
- What occurs when a user attempts to create a task with an empty title? The system should return a 422 Unprocessable Entity response with validation error details.
- How does the system handle concurrent modifications to the same task? The system should ensure data consistency and prevent race conditions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose RESTful endpoints for managing user tasks at `/api/{user_id}/tasks`
- **FR-002**: System MUST authenticate all API requests using tokens provided in the Authorization header
- **FR-003**: System MUST validate that the user_id in the URL matches the user_id in the token claims
- **FR-004**: System MUST enforce per-user data isolation by filtering all task operations by authenticated user_id
- **FR-005**: System MUST persist task data using a reliable database service
- **FR-006**: System MUST support full CRUD operations on tasks (Create, Read, Update, Delete)
- **FR-007**: System MUST provide an endpoint to update task completion status
- **FR-008**: System MUST validate task data integrity (e.g., non-empty titles)
- **FR-009**: System MUST return appropriate status codes for all operations
- **FR-010**: System MUST include timestamp fields (created_at, updated_at) for all tasks
- **FR-011**: System MUST provide detailed error messages for failed operations
- **FR-012**: System MUST implement proper request validation and sanitization

### Key Entities

- **Task**: Represents a user's todo item with attributes for identification, content, status, and timestamps
  - id: Unique identifier for the task
  - user_id: Identifier linking the task to its owner
  - title: The main content/description of the task
  - description: Optional additional details about the task
  - completed: Boolean indicating whether the task is completed
  - created_at: Timestamp when the task was created
  - updated_at: Timestamp when the task was last modified
- **User**: External entity represented by JWT claims, identified by user_id
  - user_id: Unique identifier from authentication system
  - Authentication: Verified through JWT token validation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All API endpoints respond with appropriate status codes and return correct data with acceptable response times under normal load
- **SC-002**: 100% of requests with valid authentication succeed in accessing only authorized user data
- **SC-003**: 100% of requests with invalid or missing authentication return appropriate error status
- **SC-004**: 100% of requests with mismatched user_id in URL versus token return appropriate error status
- **SC-005**: All task data is persisted reliably with high availability for database operations
- **SC-006**: Users can create, read, update, and delete tasks with high success rate
- **SC-007**: The API can handle expected concurrent users without performance degradation
- **SC-008**: All validation rules are enforced with appropriate error responses returned to clients
