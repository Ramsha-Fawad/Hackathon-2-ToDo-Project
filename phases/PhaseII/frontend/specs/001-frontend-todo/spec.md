# Feature Specification: Phase II – Full-Stack Todo Web Application (Frontend Only)

**Feature Branch**: `001-frontend-todo`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "Phase II – Full-Stack Todo Web Application (Frontend Only, Agent-Driven)

PROJECT CONTEXT
This project is a 5-phase, spec-driven mono-repo (\"Evolution of Todo\").
Phase I is complete and frozen.
We are starting Phase II.

This specification covers ONLY the FRONTEND portion of Phase II.
Backend work is explicitly deferred.

GLOBAL REUSABLE INTELLIGENCE (MANDATORY)
You MUST use the following reusable Claude Code assets:

AGENTS (from .claude/agents/)
- frontend-nextjs-expert → routing, App Router, project structure
- auth-expert → Better Auth configuration, JWT issuance
- ui-ux-expert → UX flow, responsive layout, accessibility

SKILLS (from .claude/skills/)
- auth-skill → authentication flows, JWT handling
- apicontract → frontend ↔ backend API assumptions
- ui-ux-validation-skill → usability, accessibility, responsiveness
- validation-skill → acceptance criteria verification

You MUST NOT redefine or duplicate these agents or skills.
You MUST explicitly rely on them in planning and implementation.

MONOREPO LOCATION (ABSOLUTE CONSTRAINT)
ALL artifacts produced for this spec MUST live under:

phases/PhaseII/

You are FORBIDDEN from:
- Writing to root-level /specs
- Writing to any Phase I folders
- Creating top-level /frontend or /backend folders
- Modifying reusable intelligence under .claude/

If a file does not belong to Phase II frontend, do NOT create it.

REQUIRED PHASE II STRUCTURE (ENFORCED)
phases/PhaseII/
├── frontend/
│   ├── specs/          # ALL frontend specs live here
│   ├── src/            # Next.js App Router source
│   ├── public/
│   ├── README.md
│   └── CLAUDE.md
├── backend/
│   └── specs/          # placeholder ONLY, no backend work yet
└── README.md

SCOPE
Frontend-only implementation of a multi-user Todo web application.

TECH STACK
- Next.js 16+ (App Router)
- Better Auth (frontend-only)
- JWT authentication with httpOnly cookie storage
- Email/password authentication only
- Vercel-compatible build

OBJECTIVE
Build a production-ready frontend that:
- Authenticates users via Better Auth
- Issues JWT tokens
- Attaches JWTs to all API requests
- Manages Todo CRUD via REST API
- Is responsive and accessible
- Can be deployed independently to Vercel

CORE FEATURES (MUST IMPLEMENT)
- User signup and login
- JWT session handling
- Add task (title + description)
- View task list
- Update task
- Delete task
- Toggle completion
- Loading, error, and empty states

API CONTRACT (ASSUMED, NOT IMPLEMENTED)
Use the apicontract skill.

Endpoints (JWT required):
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Frontend MUST:
- Send Authorization: Bearer <JWT>
- Handle 401/403 errors
- Never trust client-supplied user_id

SUCCESS CRITERIA
Phase II frontend is complete when:
- Auth works end-to-end
- JWTs are issued and attached correctly
- Todo CRUD UI works against assumed API
- UI passes ui-ux-validation-skill checks
- `next build` succeeds
- App is deployable to Vercel
- ALL files live under phases/PhaseII/frontend

CONSTRAINTS
- Spec-driven development only
- No manual coding
- Use Claude Code exclusively
- No backend, database, or infrastructure work

NOT BUILDING
- FastAPI backend
- SQLModel schema
- Neon DB
- Docker / Kubernetes
- Kafka, Dapr
- Chatbot (Phase III)

NEXT STEPS
After this specification:
1. /sp.clarify (frontend-only, agent-aware)
2. /sp.plan (architecture + auth flow + routing)
3. /sp.tasks
4. /sp.implement
5. Deploy to Vercel
6. Only then begin Phase II backend specification"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication and Session Management (Priority: P1)

A user visits the Todo application website, signs up for an account using email and password, and logs in to access their personal todo list. They can maintain their authenticated session using httpOnly cookies while using the app and securely log out when finished.

**Why this priority**: Authentication is foundational to the entire application - without it, users cannot access personalized todo functionality which is the core value proposition.

**Independent Test**: Can be fully tested by registering a new user account, logging in, verifying JWT token is stored and sent with API requests, maintaining session across page refreshes, and logging out successfully.

**Acceptance Scenarios**:

1. **Given** user is not logged in, **When** user navigates to the app, **Then** they see login/signup options and restricted access to todo features
2. **Given** user is on the signup page, **When** user enters valid credentials and submits, **Then** account is created and user is logged in automatically
3. **Given** user is on the login page, **When** user enters valid credentials and submits, **Then** user is authenticated and JWT token is stored securely
4. **Given** user has an active session, **When** user refreshes the page, **Then** session persists and user remains logged in
5. **Given** user is logged in, **When** user clicks logout, **Then** session is cleared and user is redirected to login page

---

### User Story 2 - Todo Management Core Features (Priority: P1)

An authenticated user can create, view, update, and delete todo items in their personal list. They can mark todos as completed or incomplete and see the updated status reflected in their list.

**Why this priority**: This represents the core functionality of the application - managing todos - without which the app has no value to users.

**Independent Test**: Can be fully tested by creating new todos, viewing the list, updating todo details, toggling completion status, and deleting todos while verifying all operations work correctly with proper JWT authentication.

**Acceptance Scenarios**:

1. **Given** user is authenticated with valid JWT, **When** user adds a new todo with title and description, **Then** the todo appears in their list and is persisted via API
2. **Given** user has existing todos, **When** user views the todo list page, **Then** all their todos are displayed with correct titles, descriptions, and completion status
3. **Given** user has an existing todo, **When** user modifies the todo details, **Then** the changes are saved and reflected in the list
4. **Given** user has an incomplete todo, **When** user marks it as complete, **Then** the completion status updates and is persisted
5. **Given** user has a completed todo, **When** user marks it as incomplete, **Then** the completion status updates and is persisted
6. **Given** user has a todo they wish to remove, **When** user deletes the todo, **Then** it is removed from their list and deleted from storage

---

### User Story 3 - Error Handling and User Experience (Priority: P2)

An authenticated user encounters various loading states, error messages, and empty states gracefully. The application provides clear feedback during API calls and handles authentication failures appropriately.

**Why this priority**: While not core functionality, this significantly impacts user experience and ensures the application behaves predictably during edge cases and network issues.

**Independent Test**: Can be fully tested by simulating loading states, API errors, authentication failures, and empty data conditions to verify appropriate user feedback and graceful error recovery.

**Acceptance Scenarios**:

1. **Given** user performs an API action, **When** request is in progress, **Then** appropriate loading indicators are shown
2. **Given** user performs an API action, **When** request fails with network error, **Then** user sees helpful error message and can retry
3. **Given** user's JWT expires during session, **When** they make an API request, **Then** they are redirected to login page with appropriate message
4. **Given** user has no todos, **When** they view the todo list, **Then** they see an appropriate empty state with guidance
5. **Given** user receives a 401/403 error, **When** API request fails, **Then** they are prompted to re-authenticate

---

### Edge Cases

- What happens when a user's JWT token expires mid-session during a todo operation?
- How does the system handle offline scenarios where API requests fail temporarily?
- What occurs when a user attempts to access another user's todo data (security boundary)?
- How does the system behave when API endpoints return unexpected data formats?
- What happens when the user tries to submit invalid data (empty titles, oversized descriptions)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via Better Auth and issue JWT tokens upon successful login
- **FR-002**: System MUST securely store JWT tokens in httpOnly cookies and attach them as "Authorization: Bearer <token>" to all API requests
- **FR-003**: Users MUST be able to create new todo items with title and description fields
- **FR-004**: Users MUST be able to view their complete list of todos with titles, descriptions, and completion status
- **FR-005**: Users MUST be able to update existing todo items including title, description, and completion status
- **FR-006**: Users MUST be able to delete individual todo items from their list
- **FR-007**: System MUST persist user session across browser refreshes and tabs using httpOnly cookies
- **FR-008**: System MUST handle API errors gracefully with global error boundary and toast notifications
- **FR-009**: System MUST redirect users to login page with preserved context when JWT authentication fails (401/403 responses)
- **FR-010**: System MUST prevent users from accessing other users' todo data by validating user_id in JWT
- **FR-011**: System MUST display loading states during API requests to indicate processing
- **FR-012**: System MUST provide empty state messaging when user has no todos
- **FR-013**: System MUST be responsive and accessible using mobile-first approach with 768px (tablet) and 1024px (desktop) breakpoints

### Key Entities

- **User**: Represents an authenticated user with unique identity, associated with JWT token for API authentication
- **Todo**: Represents a task item with title, description, completion status, and association to a specific user
- **Session**: Represents an authenticated user state maintained via JWT token stored securely in browser

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete account signup and login process within 2 minutes
- **SC-002**: All API requests include proper JWT authentication and handle 401/403 responses appropriately
- **SC-003**: Users can create, read, update, and delete todos with 95% success rate
- **SC-004**: The application builds successfully with `next build` command without errors
- **SC-005**: The application deploys successfully to Vercel platform
- **SC-006**: UI passes accessibility and responsiveness validation checks
- **SC-007**: All files are located under the phases/PhaseII/frontend directory structure
- **SC-008**: End-to-end authentication flow works without exposing user_id in client-side code

## Clarifications

### Session 2026-01-16

- Q: Where should JWT tokens be stored on the frontend for optimal security and functionality? → A: Store JWTs in httpOnly cookies
- Q: What authentication providers should be implemented for the Better Auth integration? → A: Email/password authentication only
- Q: What specific responsive design breakpoints should be implemented for the responsive UI? → A: Mobile-first: 768px (tablet) and 1024px (desktop) breakpoints
- Q: How should the application handle API errors and display them to users? → A: Global error boundary + toast notifications
- Q: How should the application handle JWT token expiration during user sessions? → A: Redirect to login with preserved context
