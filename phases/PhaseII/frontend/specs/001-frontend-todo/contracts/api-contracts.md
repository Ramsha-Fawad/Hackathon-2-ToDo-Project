# API Contracts: Phase II Frontend Todo Application

## Authentication Endpoints

### POST /api/auth/register
**Description**: Register a new user account
**Request**:
```typescript
{
  email: string,
  password: string
}
```

**Response (200)**:
```typescript
{
  user: {
    id: string,
    email: string,
    createdAt: string
  },
  jwt: string,
  expiresIn: number
}
```

**Response (400)**: Invalid input
**Response (409)**: Email already exists

### POST /api/auth/login
**Description**: Authenticate user and return JWT
**Request**:
```typescript
{
  email: string,
  password: string
}
```

**Response (200)**:
```typescript
{
  user: {
    id: string,
    email: string,
    lastLoginAt: string
  },
  jwt: string,
  expiresIn: number
}
```

**Response (400)**: Invalid input
**Response (401)**: Invalid credentials

### POST /api/auth/logout
**Description**: Log out current user
**Headers**: Authorization: Bearer <JWT>
**Response (200)**: Success

## Todo Management Endpoints

### GET /api/{user_id}/tasks
**Description**: Get all todos for the authenticated user
**Headers**: Authorization: Bearer <JWT>
**Parameters**: None
**Response (200)**:
```typescript
{
  todos: [
    {
      id: string,
      title: string,
      description: string,
      completed: boolean,
      userId: string,
      createdAt: string,
      updatedAt: string,
      dueDate?: string
    }
  ]
}
```

**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)

### POST /api/{user_id}/tasks
**Description**: Create a new todo for the authenticated user
**Headers**: Authorization: Bearer <JWT>
**Request**:
```typescript
{
  title: string,
  description?: string,
  dueDate?: string
}
```

**Response (201)**:
```typescript
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  userId: string,
  createdAt: string,
  updatedAt: string,
  dueDate?: string
}
```

**Response (400)**: Invalid input
**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)

### GET /api/{user_id}/tasks/{id}
**Description**: Get a specific todo by ID
**Headers**: Authorization: Bearer <JWT>
**Response (200)**:
```typescript
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  userId: string,
  createdAt: string,
  updatedAt: string,
  dueDate?: string
}
```

**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)
**Response (404)**: Todo not found

### PUT /api/{user_id}/tasks/{id}
**Description**: Update an existing todo
**Headers**: Authorization: Bearer <JWT>
**Request**:
```typescript
{
  title?: string,
  description?: string,
  dueDate?: string
}
```

**Response (200)**:
```typescript
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  userId: string,
  createdAt: string,
  updatedAt: string,
  dueDate?: string
}
```

**Response (400)**: Invalid input
**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)
**Response (404)**: Todo not found

### DELETE /api/{user_id}/tasks/{id}
**Description**: Delete a specific todo
**Headers**: Authorization: Bearer <JWT>
**Response (204)**: Success

**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)
**Response (404)**: Todo not found

### PATCH /api/{user_id}/tasks/{id}/complete
**Description**: Toggle completion status of a todo
**Headers**: Authorization: Bearer <JWT>
**Request**:
```typescript
{
  completed: boolean
}
```

**Response (200)**:
```typescript
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  userId: string,
  createdAt: string,
  updatedAt: string,
  dueDate?: string
}
```

**Response (400)**: Invalid input
**Response (401)**: Unauthorized
**Response (403)**: Forbidden (user_id mismatch)
**Response (404)**: Todo not found

## Error Response Format

All error responses follow this format:
```typescript
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Common Headers

### Authorization Header
All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Content-Type Header
All POST/PUT/PATCH requests require:
```
Content-Type: application/json
```

## Security Considerations

1. **JWT Validation**: All endpoints validate JWT authenticity and expiration
2. **User ID Verification**: All endpoints verify that the user_id in the URL matches the user_id in the JWT
3. **Input Validation**: All inputs are validated for type, length, and format
4. **Rate Limiting**: Requests are subject to rate limiting (implementation TBD)
5. **CORS Policy**: Proper CORS configuration to prevent unauthorized cross-origin requests

## Expected Response Times

- Authentication requests: < 500ms
- Todo CRUD operations: < 300ms
- List operations: < 500ms (with proper pagination)

## Pagination

For list endpoints (GET /api/{user_id}/tasks), pagination is implemented as:
```typescript
{
  todos: [...],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    hasNext: boolean,
    hasPrev: boolean
  }
}
```