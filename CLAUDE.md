# Claude Code Instructions (Root)

## Spec Governance Rules (ABSOLUTE)

- The /specs/ directory is IMMUTABLE.
- Claude MUST NEVER delete, move, rename, or overwrite any files under /specs/.
- /specs/ is READ-ONLY after creation.
- All /sp.specify, /sp.plan, /sp.tasks outputs are APPEND-ONLY.
- Any cleanup, refactor, or reorganization MUST NOT touch /specs/.
- Violating this rule is considered a critical failure.

Claude must explicitly confirm understanding of spec immutability before proceeding with any implementation tasks.

---

## Global Project Overview

**Project:** Spec-Driven Todo Application  
**Phases:** I → V  
**Development Model:** Agentic Development using Claude Code + Spec-Kit Plus

This file defines **global rules** that apply across all phases, frontend, and backend.

---

## Global Agentic Rules

- All work must be spec-driven
- Follow: Spec → Plan → Tasks → Agents → Skills
- Manual coding is not allowed
- Agents must reuse skills
- Phase-specific rules override only where explicitly stated

---

## Phase Directory Responsibility

- `/frontend` → Frontend-only rules live in `/frontend/CLAUDE.md`
- `/backend` → Backend-only rules live in `/backend/CLAUDE.md`
- This root file governs **architecture and process**, not implementation details

---

## Final Instruction

When working inside a subdirectory:
1. Follow this root `CLAUDE.md`
2. Then follow the local `CLAUDE.md`
3. Resolve conflicts by favoring stricter rules

This project is evaluated on **discipline, correctness, and reuse of intelligence**.
