# Todo API Service

Secure, authenticated REST API for multi-user Todo application with JWT authentication.

## Overview

This is a FastAPI-based backend service that provides secure, authenticated REST API for multi-user Todo application with Neon Serverless PostgreSQL persistence. The system enforces per-user data isolation, validates JWT tokens from Better Auth, and exposes CRUD endpoints for task management following RESTful patterns.

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (HS256 algorithm)
- **Runtime**: Python 3.13+

## Features

- Secure JWT-based authentication and authorization
- User isolation - users can only access their own tasks
- Full CRUD operations for tasks
- Task completion toggling
- Input validation (title: 1-100 chars, description: 0-1000 chars)
- Proper error handling with standardized responses
- OpenAPI documentation with JWT security schemes

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd phases/PhaseII/backend`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

## Configuration

Create a `.env` file in the backend root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database_name"

# JWT Configuration
BETTER_AUTH_SECRET="your-secret-key-for-jwt-signing"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_MINUTES=15
JWT_CLOCK_SKEW_MINUTES=5

# Server
HOST="0.0.0.0"
PORT=8000
DEBUG=false
```

## Running the Application

### Development
```bash
cd phases/PhaseII/backend/src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
cd phases/PhaseII/backend/src
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Endpoints

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Task Endpoints

- `GET    /api/{user_id}/tasks` - Get all tasks for a user
- `POST   /api/{user_id}/tasks` - Create a new task
- `GET    /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT    /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH  /api/{user_id}/tasks/{id}/complete` - Toggle task completion status

### Request/Response Examples

#### Create Task
```json
POST /api/{user_id}/tasks
{
  "title": "Sample task",
  "description": "Task description (optional)",
  "completed": false
}

Response: 201 Created
{
  "id": 1,
  "user_id": "user-123",
  "title": "Sample task",
  "description": "Task description (optional)",
  "completed": false,
  "created_at": "2026-01-23T10:00:00Z",
  "updated_at": "2026-01-23T10:00:00Z"
}
```

## Security Features

- JWT-based authentication with HS256 algorithm
- User ID validation to ensure user isolation
- Input validation for all fields
- Proper error responses (401, 403, 404, 422)
- Token expiration and clock skew tolerance (15 min expiry, 5 min skew)

## Testing

### All Tests
```bash
cd phases/PhaseII/backend
pytest
```

### Specific Test Categories
```bash
# API tests only
pytest tests/test_api/

# Model tests only
pytest tests/test_models/

# Service tests only
pytest tests/test_services/

# Authentication tests only
pytest tests/test_auth/
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for JWT signing
- `JWT_ALGORITHM`: Algorithm for JWT (default: HS256)
- `JWT_EXPIRATION_MINUTES`: Token expiry time (default: 15)
- `JWT_CLOCK_SKEW_MINUTES`: Clock skew tolerance (default: 5)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Enable debug mode (default: false)

## Integration Notes

### Frontend Connection

1. The backend expects JWT tokens in the Authorization header
2. User ID in the URL path must match the user ID in the JWT token
3. All endpoints follow RESTful patterns
4. Error responses are in JSON format with message details

### API Contract Compliance

All endpoints match the OpenAPI specification in `contracts/openapi.yaml`:
- Proper HTTP status codes
- Correct request/response schemas
- Security requirements (JWT authentication)
- User isolation enforcement

## Maintenance Guide

### Common Issues

1. **JWT Authentication Errors**: Verify `BETTER_AUTH_SECRET` matches the one used by Better Auth
2. **Database Connection**: Check `DATABASE_URL` is correctly formatted
3. **User ID Mismatch**: Ensure the user_id in the URL matches the user_id in the JWT claims

### Debugging

- Set `DEBUG=true` in environment variables for detailed error messages
- Check logs for authentication and authorization failures
- Verify JWT token format and validity

### Updating Dependencies

Regularly update dependencies using pip-tools or similar tools to address security vulnerabilities.

## Known Risks

1. **Token Expiration**: Short-lived tokens (15 min) may impact user experience for long sessions
2. **Database Connection**: No automatic retry mechanism for failed database connections
3. **Concurrent Modifications**: No specific optimistic locking beyond timestamp-based updates
4. **Rate Limiting**: No built-in rate limiting, which could lead to abuse
5. **Performance**: Under heavy load, response times may exceed 500ms threshold

## Future Work Recommendations

1. **Performance Optimization**: Implement caching for frequently accessed data
2. **Advanced Security**: Add rate limiting and more sophisticated authentication
3. **Monitoring**: Add metrics and health check endpoints
4. **Audit Logging**: Track user actions for compliance and debugging
5. **Soft Deletion**: Implement soft delete functionality instead of hard deletes
6. **Batch Operations**: Support bulk operations for improved performance
7. **Real-time Notifications**: Add WebSocket support for real-time updates
8. **Advanced Search/Filtering**: Enhance query capabilities with advanced filters
9. **Analytics**: Add usage statistics and reporting features
10. **Backup/Recovery**: Implement automated backup procedures

## License

[Specify license type here]