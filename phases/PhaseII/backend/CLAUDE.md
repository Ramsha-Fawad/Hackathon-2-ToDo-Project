# Claude Code Instructions — Backend (Phase II)

This file governs **all backend development** for Phase II of the Todo application.

---

## Phase Context

**Phase:** Phase II — Full-Stack Web Application  
**Backend Stack:**
- FastAPI
- SQLModel
- Neon Serverless PostgreSQL
- JWT-based authentication

---

## Backend Agents

- fastapi-backend-expert
- auth-agent
- database-expert

---

## Backend Skills

- auth-skill
- task-skill
- validation-skill
- persistence-skill
- api-contract-skill

---

## Backend Responsibilities

- Implement RESTful APIs
- Enforce JWT authentication
- Enforce user isolation
- Persist data using SQLModel
- Return correct HTTP status codes

---

## Authentication & Security Rules

- All API routes require valid JWT
- JWT is verified using shared secret
- Token user ID must match route user ID
- Unauthorized access returns 401/403
- Backend is stateless

---

## Data Access Rules

- All queries must be user-scoped
- No cross-user data access
- Validate resource ownership on every operation
- Fail closed on validation or auth errors

---

## Non-Goals

- Do not implement frontend logic
- Do not trust client input
- Do not weaken authentication for convenience

---

## Final Instruction

Backend changes must:
- Follow specs exactly
- Use backend agents
- Reuse skills
- Prioritize security and correctness
