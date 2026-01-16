# Spec-Driven Todo Application

This repository contains a **multi-phase, spec-driven Todo application** built using an **Agentic Development Stack**. The project is designed for a hackathon evaluation that emphasizes **process discipline, reusable intelligence, and secure full-stack architecture**.

---

## Project Overview

The Todo application evolves incrementally across five phases, starting from a simple in-memory console app and culminating in a cloud-native, AI-powered system.

Each phase is implemented using **Claude Code + Spec-Kit Plus**, with strict adherence to specification immutability and agent-based execution.

---

## Hackathon Phases

### Phase I — Console Application
- Python-based in-memory Todo app
- Spec-driven development
- Core task management features

### Phase II — Full-Stack Web Application
- Next.js frontend (App Router)
- FastAPI backend
- SQLModel + Neon Serverless PostgreSQL
- JWT-based authentication using Better Auth
- Secure, multi-user task isolation

### Phase III — AI-Powered Todo Chatbot
- OpenAI ChatKit
- Agents SDK
- Official MCP SDK
- Natural language task management

### Phase IV — Local Kubernetes Deployment
- Dockerized services
- Minikube
- Helm charts
- kubectl-ai and kagent

### Phase V — Advanced Cloud Deployment
- DigitalOcean DOKS
- Kafka for event streaming
- Dapr for service orchestration

---

## Development Methodology

This project strictly follows an **Agentic, Spec-Driven workflow**:

1. Write immutable specifications
2. Generate implementation plans
3. Break plans into executable tasks
4. Execute tasks via specialized agents
5. Reuse intelligence through agent skills

Manual coding outside this workflow is not permitted.

---

## Repository Structure (High-Level)

```
/
├── CONSTITUTION.md              # Project Constitution
├── README.md                    # This file
├── CLAUDE.md                    # Instructions for Claude Code usage
├── src/                         # General source code root
├── specs_history/               # Folder to store all feature specs
└── phases/                      # Main directory for all 5 phases
    ├── PhaseI/                  # In-Memory Python CLI
    │   ├── specs/               # Phase-specific Specs
    │   ├── src/                 # Phase-specific source code
    │   ├── tests/               # Unit and integration test placeholders
    │   └── README.md            # Phase description
    ├── PhaseII/                 # Full-Stack Web App
    │   ├── specs/
    │   ├── src/
    │   ├── tests/
    │   └── README.md
    ├── PhaseIII/                # AI-Powered Chatbot
    │   ├── specs/
    │   ├── src/
    │   ├── tests/
    │   └── README.md
    ├── PhaseIV/                 # Local Kubernetes Deployment
    │   ├── specs/
    │   ├── src/
    │   ├── tests/
    │   └── README.md
    └── PhaseV/                  # Advanced Cloud Deployment
        ├── specs/
        ├── src/
        ├── tests/
        └── README.md
```


---

## Agentic Development Stack

- **Agents**: Specialized execution units (frontend, backend, auth, DB, UI/UX)
- **Skills**: Reusable intelligence units (auth, validation, persistence, API contracts)
- **Specs**: Single source of truth for behavior and architecture

This structure enables consistency, reuse, and evaluable development practices.

---

## Security Model

- JWT-based stateless authentication
- Strict user isolation on all API operations
- Shared secret between frontend and backend
- Backend as the source of truth for authorization

---

## Evaluation Focus

This project is evaluated on:
- Spec immutability compliance
- Correct agent usage
- Skill reuse
- Security and correctness
- Phase-by-phase architectural evolution

---

## License & Usage

This repository is intended for **educational and hackathon evaluation purposes**.  
All design decisions prioritize clarity, security, and process rigor over shortcuts.
