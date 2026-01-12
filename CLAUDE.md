# Claude Code Instructions
## Spec Governance Rules (ABSOLUTE)

- The /specs/ directory is IMMUTABLE.
- Claude MUST NEVER delete, move, rename, or overwrite any files
  under /specs/.
- /specs/ is READ-ONLY after creation.
- All /sp.specify, /sp.plan, /sp.tasks outputs are APPEND-ONLY.
- Any cleanup, refactor, or reorganization MUST NOT touch /specs/.
- Violating this rule is considered a critical failure.

Claude must explicitly confirm understanding of spec immutability
before proceeding with any implementation tasks.