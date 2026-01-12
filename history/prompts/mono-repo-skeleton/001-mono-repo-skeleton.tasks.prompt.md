---
id: 001
title: Mono Repo Skeleton Generation Tasks
stage: tasks
date: 2026-01-09
surface: agent
model: Claude Sonnet 4.5
feature: mono-repo-skeleton
branch: 001-mono-repo-skeleton
user: User
command: /sp.tasks
labels: ["mono-repo", "skeleton", "structure", "spec-driven-development", "tasks"]
links:
  spec: specs/001-mono-repo-skeleton/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-mono-repo-skeleton/tasks.md
tests:
 - none
---

## Prompt

specs/001-mono-repo-skeleton/spec.md

Objective:

Convert the Mono Repo implementation plan into a list of concrete tasks for Claude Code to generate the folder structure and placeholder files for the Evolution of Todo project.

Task Requirements:

Each task should be atomic (single action) and executable by Claude Code.

Tasks must cover all root-level folders, phase folders, Specs, source, tests, and placeholder files.

Include minimal placeholder content to prevent empty folders (e.g., .gitkeep, README.md, initial spec markdowns).

Tasks:

Root-Level Structure

Create CONSTITUTION.md with placeholder content: # Evolution of Todo Project Constitution

Create README.md with placeholder content: # Evolution of Todo - Mono Repo

Create CLAUDE.md with placeholder content: # Claude Code Instructions

Create /src/ folder

Create /specs_history/ folder

Phase Folders
For each Phase (PhaseI → PhaseV):

Create /phases/PhaseX/ folder

Inside PhaseX, create:

/specs/ folder

/src/ folder

/tests/ folder

README.md with content: # Phase X: [Phase Name]

Add a .gitkeep or minimal placeholder in empty folders if required

Additional Artifacts

Create /specs/001-mono-repo-skeleton/checklists/requirements.md as placeholder

Create /history/prompts/mono-repo-skeleton/001-mono-repo-skeleton.spec.prompt.md

Constraints:

Folder and file names must be lowercase, hyphenated if multi-word (e.g., phase_i)

Must follow Python conventions for Phase I, web conventions for Phase II, AI/deployment conventions for later phases

No feature implementations yet

Tasks must be fully executable by Claude Code

Outcome / Success Criteria:

All folders and placeholder files are created exactly as planned

Mono Repo skeleton is ready to start Phase I development

Ready for Spec-driven feature development with Claude Code

## Response snapshot

Created a comprehensive task list for the Mono Repo Skeleton Generation feature with 24 specific tasks organized across 5 phases:

- Phase 1: Setup (3 tasks) - Creating root-level documentation and directories
- Phase 2: Foundational (3 tasks) - Creating the phases directory structure
- Phase 3: User Story 1 (7 tasks) - Implementing the core structure for hackathon developers
- Phase 4: User Story 2 (3 tasks) - Setting up structure for AI agents
- Phase 5: User Story 3 (3 tasks) - Enabling navigation between phases
- Phase N: Polish (5 tasks) - Final validation and cleanup

Each task follows the required format with proper checkboxes, task IDs, parallelization markers [P], and user story labels [US1, US2, US3] where appropriate. The tasks are organized to enable independent implementation and testing of each user story, with clear dependencies and parallel execution opportunities identified.

## Outcome

- ✅ Impact: Created complete task list for mono repo skeleton structure implementation
- 🧪 Tests: none
- 📁 Files: Created tasks.md with detailed implementation tasks
- 🔁 Next prompts: Ready to execute tasks with Claude Code
- 🧠 Reflection: Tasks successfully organized by user story to enable independent development.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - all requirements met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Execute the tasks to create the folder structure