---
name: auth-skill
description: Handle secure JWT-based authentication and user identity verification. Use for login flows, API protection, and user isolation.
---

# Authentication Skill

## Instructions

1. **JWT verification**
   - Validate token signature using shared secret
   - Check token expiration
   - Decode claims safely

2. **Identity extraction**
   - Extract user ID and email from token
   - Treat JWT as the source of truth
   - Ignore client-provided identifiers

3. **Authorization enforcement**
   - Match token user ID with request context
   - Reject mismatched or missing credentials
   - Enforce stateless authentication

## Best Practices
- Fail closed (deny by default)
- Never trust unauthenticated input
- Use short-lived tokens where possible
- Do not expose auth error details

## Example Usage
```text
Authorization: Bearer <jwt-token>
