# Claude Code Instructions — Frontend (Phase II)

This file governs **all frontend development** for Phase II of the Todo application.

---

## Phase Context

**Phase:** Phase II — Full-Stack Web Application  
**Frontend Stack:**
- Next.js 16+ (App Router)
- Better Auth
- REST API integration

---

## Frontend Agents

- frontend-nextjs-expert
- ui-ux-expert
- auth-agent (frontend usage only)

---

## Frontend Skills

- auth-skill
- api-contract-skill
- ui-ux-validation-skill
- validation-skill

---

## Frontend Responsibilities

- Implement responsive UI using Next.js App Router
- Integrate Better Auth for signup/signin
- Attach JWT tokens to all authenticated API requests
- Handle loading, error, and empty states
- Respect backend authorization decisions

---

## Authentication Rules (Frontend)

- JWTs are issued by Better Auth
- JWT must be attached as `Authorization: Bearer <token>`
- Frontend must never assume authorization
- Backend is the source of truth

---

## UI/UX Rules

- Mobile-first design
- Accessibility (keyboard, screen readers)
- Clear feedback for all user actions
- Consistent interaction patterns

---

## Non-Goals

- Do not implement backend logic
- Do not store secrets client-side
- Do not bypass authentication

---

## Final Instruction

All frontend changes must:
- Follow the spec
- Use frontend agents
- Reuse skills
- Preserve security and usability
