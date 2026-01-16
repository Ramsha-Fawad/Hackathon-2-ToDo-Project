---
name: task-skill
description: Encapsulate todo task business logic. Use for creating, updating, deleting, and completing tasks.
---

# Task Management Skill

## Instructions

1. **Task creation**
   - Assign task to authenticated user
   - Initialize completion state
   - Validate required fields

2. **Task updates**
   - Modify task title or description
   - Prevent cross-user modifications
   - Preserve task ownership

3. **Completion handling**
   - Toggle completed status
   - Track state changes consistently

4. **Deletion**
   - Allow only owner to delete
   - Ensure task exists before removal

## Best Practices
- Keep logic independent of storage layer
- Enforce ownership at every operation
- Avoid duplicating task rules across layers

## Example Structure
```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "completed": false,
  "user_id": "user-uuid"
}