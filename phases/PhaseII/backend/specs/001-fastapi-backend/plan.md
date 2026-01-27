# Implementation Plan: Phase II Backend – Todo API Service

**Branch**: `001-fastapi-backend` | **Date**: 2026-01-23 | **Spec**: specs/001-fastapi-backend/spec.md

**Input**: Feature specification from `/specs/001-fastapi-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a production-ready FastAPI backend service that provides secure, authenticated REST API for multi-user Todo application with Neon Serverless PostgreSQL persistence. The system enforces per-user data isolation, validates JWT tokens from Better Auth, and exposes CRUD endpoints for task management following RESTful patterns.

## Technical Context

Architecture consists of multiple layers: API layer with FastAPI routers, authentication layer with JWT verification, service layer with business logic, and persistence layer with SQLModel ORM. Request flow follows: HTTP request → CORS middleware → JWT verification → user_id validation → authorization → service logic → database access → response.

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, python-multipart, uvicorn
**Storage**: Neon Serverless PostgreSQL via SQLModel ORM
**Testing**: pytest with FastAPI test client, SQLModel test fixtures
**Target Platform**: Linux server environment (container-ready)
**Project Type**: web backend service
**Performance Goals**: Sub-500ms response times under normal load, support 100+ concurrent users
**Constraints**: JWT-based authentication, user isolation enforcement, SQL injection prevention
**Scale/Scope**: Multi-tenant SaaS model supporting thousands of users with isolated data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development: Complete specification exists at specs/001-fastapi-backend/spec.md
- ✅ Incremental Evolution: Building on Phase I CLI and preparing for Phase III AI integration
- ✅ Test-First: Unit and integration tests planned for all API endpoints and auth functionality
- ✅ Reusability & Modularity: Following FastAPI's dependency injection and modular router patterns
- ✅ Cloud-Native Design: Designed for containerization with Neon PostgreSQL connectivity

## Architecture Sketch

High-level backend architecture consists of multiple layers:
- **API Layer**: FastAPI routers handling HTTP requests/responses
- **Authentication Layer**: JWT verification middleware and dependency
- **Authorization Layer**: User ID validation and permission checking
- **Service Layer**: Business logic for task operations
- **Persistence Layer**: SQLModel models and database session management

Request flow: HTTP request → CORS middleware → JWT verification → user_id validation → authorization → service logic → database access → response

## Module & Folder Structure Plan

**Structure Decision**: Web application backend with clear separation of concerns following FastAPI best practices

```text
phases/PhaseII/backend/src/
├── main.py                 # Application entry point and startup
├── config/                 # Configuration and settings
│   └── settings.py         # Settings management with environment variables
├── api/                    # API router definitions
│   ├── __init__.py
│   ├── deps.py             # Shared dependencies (auth, database session)
│   └── v1/                 # Version 1 API routes
│       ├── __init__.py
│       ├── auth.py         # Authentication-related dependencies
│       └── tasks.py        # Task CRUD endpoints
├── models/                 # SQLModel database models
│   ├── __init__.py
│   ├── base.py             # Base model configuration
│   └── task.py             # Task model definition
├── schemas/                # Pydantic schemas for request/response validation
│   ├── __init__.py
│   ├── task.py             # Task input/output schemas
│   └── auth.py             # Authentication schemas
├── services/               # Business logic layer
│   ├── __init__.py
│   └── task_service.py     # Task operations logic
├── database/               # Database connection and session management
│   ├── __init__.py
│   ├── engine.py           # Database engine configuration
│   └── session.py          # Session dependency and context manager
└── utils/                  # Utility functions
    ├── __init__.py
    ├── auth.py             # JWT token utilities
    └── validators.py       # Input validation utilities

phases/PhaseII/backend/tests/
├── __init__.py
├── conftest.py             # pytest fixtures
├── test_api/               # API endpoint tests
│   ├── __init__.py
│   └── test_tasks.py       # Task endpoint tests
├── test_models/            # Database model tests
│   ├── __init__.py
│   └── test_task.py        # Task model tests
├── test_services/          # Service layer tests
│   ├── __init__.py
│   └── test_task_service.py # Task service tests
└── test_auth/              # Authentication tests
    ├── __init__.py
    └── test_jwt.py         # JWT validation tests

phases/PhaseII/backend/
├── requirements.txt        # Production dependencies
├── requirements-dev.txt    # Development dependencies
├── alembic/                # Database migrations (future)
│   └── versions/
└── alembic.ini             # Migration configuration (future)
```

Each module serves a specific purpose:
- `api/`: Handles routing and request/response processing
- `models/`: Defines database schema with SQLModel
- `schemas/`: Manages data validation with Pydantic
- `services/`: Contains business logic separated from API concerns
- `database/`: Manages database connections and sessions
- `utils/`: Provides reusable helper functions

## Key Technical Decisions

- **JWT Verification**: Using PyJWT library with HS256 algorithm, verifying token signature against shared secret from environment variables
- **User ID Strategy**: Extracting user_id from JWT claims and validating against URL parameter to enforce user isolation
- **SQLModel Session**: Using dependency injection pattern with FastAPI to provide database sessions, enabling automatic cleanup and transaction management
- **Error Handling**: FastAPI exception handlers for consistent error responses in JSON format with error codes
- **Database Lifecycle**: Connection pooling with SSL enforcement, automatic session creation/cleanup via FastAPI dependencies
- **CORS Policy**: Restrictive CORS allowing only frontend origin, preventing cross-origin requests from unauthorized domains

## API Contract Enforcement Strategy

- **User Isolation**: Every endpoint validates that the user_id in JWT claims matches the user_id in the URL path
- **Mismatch Handling**: Returns 403 Forbidden when JWT user_id doesn't match URL user_id
- **Status Codes**:
  - 200 OK for successful GET/PUT/PATCH requests
  - 201 Created for successful POST requests
  - 401 Unauthorized for invalid/missing JWT
  - 403 Forbidden for user_id mismatch
  - 404 Not Found for missing resources
  - 422 Unprocessable Entity for validation errors
- **OpenAPI Security**: JWT bearer token security scheme configured in FastAPI

## Persistence & Data Strategy

- **Task Ownership**: All queries filtered by user_id to ensure user isolation
- **Indexing**: Primary key on id, index on user_id for efficient filtering
- **Transaction Boundaries**: Individual operations wrapped in transactions via SQLModel session context
- **Concurrency**: Optimistic locking approach to handle simultaneous updates (via updated_at timestamp)

## Validation & Quality Strategy

- **Input Validation**: Pydantic schemas for all request bodies with character limits (title: 1-100 chars, description: 0-1000 chars)
- **Auth Failure**: JWT validation dependency returning 401 for invalid tokens
- **Data Integrity**: SQLModel constraints and FastAPI validation errors
- **Logging**: Structured logging for auth failures, errors, and important operations

## Testing & Verification Plan

- **Unit Tests**: Individual function testing for service layer and utilities
- **Integration Tests**: Full API endpoint testing with database integration
- **Auth Tests**: JWT validation and user isolation verification
- **Database Tests**: Model validation and query correctness
- **Manual Verification**: Judge checklist for security, functionality, and performance validation

## Phase Boundaries

**Completed in Phase II Backend:**
- Full CRUD API for user tasks
- JWT-based authentication and authorization
- User isolation enforcement
- Database persistence with Neon PostgreSQL
- Comprehensive error handling
- Basic testing framework

**Explicitly Deferred to Later Phases:**
- Real-time notifications (Phase III AI Chatbot)
- Advanced search/filtering (Phase III+)
- Advanced analytics (Phase IV+)
- Advanced security features beyond basic JWT (Phase IV+)

## Project Structure

### Documentation (this feature)

```text
specs/001-fastapi-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code Structure

The source code follows the structure outlined in the Module & Folder Structure Plan section above.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |