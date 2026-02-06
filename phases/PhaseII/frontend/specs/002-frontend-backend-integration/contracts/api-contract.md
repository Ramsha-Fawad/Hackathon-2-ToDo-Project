# API Contract: Frontend-Backend Integration

## Overview

This document defines the contract between the frontend and backend services for the Todo application. It specifies the expected request/response formats, authentication requirements, and error handling patterns.

## Authentication Requirements

All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The JWT token must contain a `user_id` claim that matches the `user_id` in the URL path. If these do not match, the backend will return a 403 Forbidden response.

## Base URL

The base URL for all API requests is determined by the `BACKEND_API_BASE_URL` environment variable.

## Endpoint Specifications

### GET /api/{user_id}/tasks

**Purpose**: Retrieve all tasks for a specific user

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json (implicit)

**Response**:
- `200 OK`: Array of Task objects
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `500 Internal Server Error`: Server error

**Response Body (200)**:
```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "title": "Task title",
    "description": "Task description (optional)",
    "completed": false,
    "created_at": "2026-01-23T10:00:00Z",
    "updated_at": "2026-01-23T10:00:00Z"
  }
]
```

### POST /api/{user_id}/tasks

**Purpose**: Create a new task for the specified user

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json

**Request Body**:
```json
{
  "title": "Task title (required)",
  "description": "Task description (optional)",
  "completed": false
}
```

**Response**:
- `201 Created`: Task created successfully
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

**Response Body (201)**:
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Task title",
  "description": "Task description (optional)",
  "completed": false,
  "created_at": "2026-01-23T10:00:00Z",
  "updated_at": "2026-01-23T10:00:00Z"
}
```

### GET /api/{user_id}/tasks/{id}

**Purpose**: Retrieve a specific task by ID

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)
- `id` (path): Task ID

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json (implicit)

**Response**:
- `200 OK`: Task object
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

**Response Body (200)**:
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Task title",
  "description": "Task description (optional)",
  "completed": false,
  "created_at": "2026-01-23T10:00:00Z",
  "updated_at": "2026-01-23T10:00:00Z"
}
```

### PUT /api/{user_id}/tasks/{id}

**Purpose**: Update an existing task

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)
- `id` (path): Task ID

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json

**Request Body**:
```json
{
  "title": "Updated task title (required)",
  "description": "Updated task description (optional)",
  "completed": true
}
```

**Response**:
- `200 OK`: Task updated successfully
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `404 Not Found`: Task not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

### DELETE /api/{user_id}/tasks/{id}

**Purpose**: Delete a specific task

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)
- `id` (path): Task ID

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json (implicit)

**Response**:
- `204 No Content`: Task deleted successfully
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

### PATCH /api/{user_id}/tasks/{id}/complete

**Purpose**: Toggle the completion status of a task

**Authentication**: Required (JWT Bearer token)

**Parameters**:
- `user_id` (path): User ID from JWT token (must match token's user_id)
- `id` (path): Task ID

**Headers**:
- `Authorization`: Bearer token
- `Content-Type`: application/json

**Request Body**:
```json
{
  "completed": true
}
```

**Response**:
- `200 OK`: Task completion status updated
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: user_id mismatch
- `404 Not Found`: Task not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Error Response Format

All error responses follow this standard format:

```json
{
  "detail": "Human-readable error message"
}
```

## Validation Rules

- **Title**: 1-100 characters
- **Description**: 0-1000 characters
- **user_id**: Must match the authenticated user's ID in the JWT token
- **completed**: Boolean value (true/false)

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: User ID in URL doesn't match JWT token's user ID
- `404 Not Found`: Requested resource doesn't exist
- `422 Unprocessable Entity`: Validation error in request body
- `500 Internal Server Error`: Server-side error