# Quickstart Guide: Phase II Backend – Todo API Service

## Prerequisites

- Python 3.13+
- pip package manager
- Neon Serverless PostgreSQL database
- Better Auth for JWT generation
- Environment variables configured (see Configuration section)

## Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd phases/PhaseII/backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Development Dependencies (for testing)
```bash
pip install -r requirements-dev.txt
```

## Configuration

### Environment Variables
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

## Running Tests

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

## Database Migrations

Initial setup:
```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## Troubleshooting

### Common Issues
1. **JWT Authentication Errors**: Verify `BETTER_AUTH_SECRET` matches the one used by Better Auth
2. **Database Connection**: Check `DATABASE_URL` is correctly formatted
3. **User ID Mismatch**: Ensure the user_id in the URL matches the user_id in the JWT claims

### Debugging
- Set `DEBUG=true` in environment variables for detailed error messages
- Check logs for authentication and authorization failures
- Verify JWT token format and validity