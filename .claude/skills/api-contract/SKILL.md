---
name: api-contract-skill
description: Ensure frontend and backend remain aligned on API structure and behavior. Use when defining or consuming REST APIs.
---

# API Contract Skill

## Instructions

1. **Endpoint consistency**
   - Match HTTP methods to intent
   - Use stable URL patterns
   - Follow REST conventions

2. **Request/response alignment**
   - Validate payload shapes
   - Ensure predictable responses
   - Handle errors consistently

3. **Version awareness**
   - Avoid breaking changes
   - Update specs when contracts change

## Best Practices
- Backend is the source of truth
- Frontend must follow contract strictly
- Prefer explicit over implicit behavior

## Example Endpoint
```http
GET /api/{user_id}/tasks
