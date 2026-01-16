---
name: validation-skill
description: Validate inputs, parameters, and state consistently. Use for defensive checks across backend and frontend logic.
---

# Validation Skill

## Instructions

1. **Input validation**
   - Validate request payloads
   - Ensure required fields are present
   - Enforce correct data types

2. **Parameter validation**
   - Validate UUIDs and IDs
   - Reject malformed parameters
   - Handle missing resources safely

3. **State validation**
   - Ensure entity ownership
   - Prevent invalid state transitions

## Best Practices
- Validate early and consistently
- Prefer explicit error handling
- Do not leak internal state details
- Treat all external input as untrusted

## Example
```text
If task does not belong to user → reject request
