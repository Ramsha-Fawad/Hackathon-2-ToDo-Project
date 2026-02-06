# Quickstart Guide: Frontend-Backend Integration

## Prerequisites

- Node.js 18+ with npm/yarn
- Better Auth configured and running
- Backend API service running (FastAPI)
- Environment variables configured (see Configuration section)

## Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd phases/PhaseII/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend root directory:

```bash
# Backend API
NEXT_PUBLIC_BACKEND_API_BASE_URL="http://localhost:8000"

# Better Auth (public variables only)
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:8080"
```

## Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

## API Integration

### Authentication Flow
1. User signs up/in via Better Auth
2. JWT token received and stored securely
3. Token automatically attached to all API requests
4. User ID validated against URL parameters

### Available Endpoints
The frontend integrates with these backend endpoints:
- `GET    /api/{user_id}/tasks` - Get all tasks for a user
- `POST   /api/{user_id}/tasks` - Create a new task
- `GET    /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT    /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH  /api/{user_id}/tasks/{id}/complete` - Toggle task completion status

### Request/Response Examples

#### Create Task
```javascript
// The API client automatically handles:
// - Token injection in Authorization header
// - Content-Type: application/json
// - Error handling
const response = await apiClient.post(`/api/${userId}/tasks`, {
  title: "Sample task",
  description: "Task description",
  completed: false
});
```

#### Error Handling
```javascript
// The API client returns standardized error objects:
{
  status: 401,
  message: "Session expired",
  timestamp: "2026-01-28T10:00:00Z"
}
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Categories
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e
```

## Configuration Options

### API Client Settings
- **Timeout**: 10 seconds for all requests
- **Retry Policy**: Exponential backoff (1s, 2s, 4s)
- **Cache Duration**: 5 minutes for GET requests
- **Token Refresh**: 2 minutes before expiration

### Security Settings
- **Token Storage**: Memory-first with HttpOnly cookie fallback
- **XSS Protection**: Content Security Policy headers
- **Request Validation**: Client-side validation before backend requests
- **User ID Validation**: Client validates URL user_id matches JWT subject

## Troubleshooting

### Common Issues
1. **JWT Authentication Errors**: Verify `NEXT_PUBLIC_BACKEND_API_BASE_URL` matches the backend server
2. **User ID Mismatch**: Check that URL user_id matches the user_id in the JWT claims
3. **CORS Issues**: Ensure backend allows requests from frontend origin
4. **Token Expiration**: Verify token refresh is working correctly

### Debugging
- Set `NEXT_PUBLIC_DEBUG=true` in environment for detailed logging
- Check browser console for authentication and API errors
- Verify network requests include proper Authorization headers
- Confirm JWT token contains correct user_id claim