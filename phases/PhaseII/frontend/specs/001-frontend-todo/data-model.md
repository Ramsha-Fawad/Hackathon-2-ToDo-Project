# Data Model: Phase II Frontend Todo Application

## Core Entities

### User
- **id**: Unique identifier for the authenticated user
- **email**: User's email address (used for authentication)
- **createdAt**: Timestamp of account creation
- **lastLoginAt**: Timestamp of last successful login
- **isActive**: Boolean indicating if account is active

**Validation Rules**:
- Email must be valid email format
- Email must be unique
- User must be authenticated to access protected resources

### Todo
- **id**: Unique identifier for the todo item
- **title**: String containing the todo title (required)
- **description**: Optional string with detailed todo description
- **completed**: Boolean indicating completion status (default: false)
- **userId**: Foreign key linking to User entity (from JWT)
- **createdAt**: Timestamp of todo creation
- **updatedAt**: Timestamp of last modification
- **dueDate**: Optional timestamp for todo deadline

**Validation Rules**:
- Title is required and must be 1-100 characters
- Description is optional and limited to 1000 characters
- Completed defaults to false
- userId must match authenticated user's JWT
- createdAt and updatedAt are automatically managed

### Session
- **jwt**: JWT token string (stored in httpOnly cookie)
- **expiresAt**: Timestamp when token expires
- **userId**: Associated user identifier
- **createdAt**: Session creation timestamp

**Validation Rules**:
- JWT must be valid and not expired
- Session must correspond to valid user account
- Automatic cleanup of expired sessions

## State Transitions

### Todo State Transitions
- `incomplete` → `completed`: When user marks todo as complete
- `completed` → `incomplete`: When user unmarks todo as complete

### Session State Transitions
- `anonymous` → `authenticated`: After successful login
- `authenticated` → `expired`: When JWT token expires
- `authenticated` → `logged_out`: When user initiates logout
- `expired` → `anonymous`: After token expiration

## Relationships

### User → Todo (One-to-Many)
- One user can have many todos
- Todos are filtered by userId from JWT token
- User can only access their own todos

### Session → User (Many-to-One)
- Many sessions may exist for one user (concurrent devices)
- Each session corresponds to one user
- Session validity depends on user account status

## API Data Structures

### Todo Response Object
```typescript
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  userId: string,
  createdAt: string, // ISO date string
  updatedAt: string, // ISO date string
  dueDate?: string   // Optional ISO date string
}
```

### Todo Request Object
```typescript
{
  title: string,           // Required
  description?: string,    // Optional
  dueDate?: string        // Optional ISO date string
}
```

### User Response Object
```typescript
{
  id: string,
  email: string,
  createdAt: string,      // ISO date string
  lastLoginAt: string     // ISO date string
}
```

### Authentication Response Object
```typescript
{
  user: User,
  jwt: string,
  expiresIn: number       // Seconds until expiration
}
```