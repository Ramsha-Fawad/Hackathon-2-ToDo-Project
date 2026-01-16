---
name: persistence-skill
description: Manage data persistence and retrieval using SQLModel and PostgreSQL. Use for database access and user-scoped queries.
---

# Persistence Skill

## Instructions

1. **Schema interaction**
   - Use SQLModel for entity definitions
   - Maintain clear user ownership fields

2. **CRUD operations**
   - Scope all queries by user ID
   - Use transactions for writes
   - Handle missing records safely

3. **Data integrity**
   - Enforce constraints
   - Prevent cross-user data access

## Best Practices
- Keep persistence logic isolated
- Avoid embedding business rules in queries
- Optimize for serverless PostgreSQL

## Example Query Pattern
```sql
SELECT * FROM tasks WHERE user_id = :user_id
