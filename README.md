# Evolution of Todo - Mono Repo

## Project Structure

This mono repo contains 5 distinct phases of the Evolution of Todo project, representing the progression from simple console app to complex cloud deployment:

### Phases

- **Phase I**: In-Memory Python CLI
- **Phase II**: Full-Stack Web App
- **Phase III**: AI-Powered Chatbot
- **Phase IV**: Local Kubernetes Deployment
- **Phase V**: Advanced Cloud Deployment

### Directory Structure

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

## Usage

This structure is designed to support spec-driven development workflow where each phase builds upon the previous one. The standardized subdirectories (specs, src, tests) in each phase enable consistent development practices across all phases of the project.