# Data Model: Phase II Backend – Todo API Service

## Task Entity

### Fields
- **id**: Integer, Primary Key, Auto-increment
  - Purpose: Unique identifier for each task
  - Constraints: Required, Unique

- **user_id**: String, Indexed
  - Purpose: Links the task to its owner
  - Constraints: Required, Indexed for efficient querying

- **title**: String (1-100 characters)
  - Purpose: Main content/description of the task
  - Constraints: Required, Length 1-100 characters

- **description**: String (0-1000 characters)
  - Purpose: Additional details about the task
  - Constraints: Optional, Length 0-1000 characters

- **completed**: Boolean
  - Purpose: Indicates whether the task is completed
  - Constraints: Required, Default False

- **created_at**: DateTime
  - Purpose: Timestamp when the task was created
  - Constraints: Required, Auto-set on creation

- **updated_at**: DateTime
  - Purpose: Timestamp when the task was last modified
  - Constraints: Required, Auto-updated on modification

### Relationships
- **Owner relationship**: Each task belongs to a user (identified by user_id from JWT claims)
- **User relationship**: External relationship where user_id corresponds to JWT claims

### Validation Rules
- Title must be between 1-100 characters
- Description must be between 0-1000 characters
- user_id must match the authenticated user's ID from JWT
- completed defaults to False when creating new tasks

### Indexes
- Primary Key: id
- Foreign Key Index: user_id (for efficient user-based queries)

## User Entity (External)

### Fields
- **user_id**: String
  - Purpose: Unique identifier from authentication system
  - Source: Extracted from JWT token claims
  - Constraints: Required for all operations

### Notes
- User entity is external to the system (managed by Better Auth)
- Only user_id is referenced in the system (extracted from JWT claims)
- No user data is stored locally - only user_id for association