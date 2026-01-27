# Frontend-Backend Integration Specification

## 1. PURPOSE & NON-GOALS

### Purpose
This specification defines how the existing Next.js frontend communicates with the FastAPI backend service. It covers authentication token handling, API communication patterns, error handling, and user identity enforcement to ensure secure and reliable integration between the two systems.

### Non-Goals
- This is NOT a backend specification (backend is frozen and immutable)
- This is NOT a UI redesign or feature expansion
- This is NOT a security architecture overhaul
- This is NOT a performance optimization specification
- This does NOT modify existing backend endpoints or authentication mechanisms

## 2. AUTHENTICATION FLOW

### Signup Flow
1. User enters registration details in the frontend
2. Better Auth handles user creation and JWT issuance
3. JWT token is stored securely in the frontend (memory-first with persistent fallback)
4. User is redirected to the dashboard to begin using the application

### Signin Flow
1. User enters login credentials in the frontend
2. Better Auth authenticates the user and issues a JWT
3. JWT token is stored securely in the frontend
4. User is redirected to the dashboard with active session

### JWT Issuance
- JWT tokens are issued by Better Auth upon successful authentication
- Tokens follow standard JWT format with HS256 algorithm
- Tokens contain user_id in the payload for identity verification
- Frontend receives tokens through Better Auth's authentication callbacks

### Token Storage Strategy
- **Primary**: Memory storage during active browser session for security
- **Fallback**: HttpOnly secure cookies for persistence across browser restarts
- **Justification**: Memory storage prevents XSS attacks from accessing tokens, while HttpOnly cookies provide persistence without JavaScript access
- Tokens are cleared from memory on tab/window close or logout

### Logout Behavior
1. Clear JWT token from memory and storage
2. Invalidate session with Better Auth
3. Redirect user to login page
4. Clear any cached user data or temporary state

### Token Expiration Handling
- Monitor token expiration in real-time using token claims
- Automatically refresh token when approaching expiration (within 2 minutes)
- If refresh fails, redirect to login page with appropriate messaging
- Display user-friendly messages about session status

## 3. API CLIENT DESIGN

### Centralized API Client Strategy
- Create a singleton API client instance for the entire application
- Use interceptors for automatic header injection and error handling
- Implement request/response caching for frequently accessed data
- Provide consistent error handling across all API calls

### Base URL Handling
- Configure BASE_API_URL through environment variables
- Support different environments (development, staging, production)
- Implement graceful fallbacks for misconfigured URLs
- Log configuration issues for debugging purposes

### Header Injection
- Automatically inject Authorization header with Bearer token for all requests
- Include Content-Type: application/json for POST/PUT/PATCH requests
- Add X-Requested-With header to identify client requests
- Handle dynamic header updates when token changes

### Error Normalization Layer
- Transform raw HTTP errors into standardized frontend error objects
- Map HTTP status codes to user-friendly messages
- Provide structured error data for UI components
- Implement automatic retry mechanisms for network failures

## 4. USER ID HANDLING

### Source of user_id
- Extract user_id from the authenticated user's JWT token payload
- Use Better Auth's user context to retrieve user identity
- Validate that user_id matches the format expected by the backend
- Implement fallback mechanisms if user_id is unavailable

### How Frontend Ensures URL user_id Matches Authenticated User
- Compare the user_id in the URL path with the user_id from the JWT token
- Block requests if user_id mismatch is detected
- Implement client-side validation before sending requests to backend
- Display appropriate error messages when mismatch occurs

### Prevention of User Spoofing
- Never allow user_id to be passed as a client-side parameter
- Always derive user_id from authenticated session
- Validate user identity on every API request
- Implement strict input sanitization for all user-provided data

## 5. ERROR HANDLING & UX CONTRACT

### 401 Unauthorized
- UX: Display "Session expired" message and redirect to login
- Action: Clear authentication tokens and initiate re-authentication flow
- Logging: Record the event for security monitoring

### 403 Forbidden
- UX: Display "Access denied" message with explanation
- Action: Prevent the action and guide user to appropriate resources
- Logging: Record the event as potential security concern

### 404 Not Found
- UX: Display "Item not found" with option to return to safe location
- Action: Allow user to navigate to available resources
- Logging: Low priority logging for debugging purposes

### 500 Server Error
- UX: Display "Service temporarily unavailable" with retry option
- Action: Provide user with alternative paths or contact information
- Logging: High priority logging for immediate investigation

### Network Failure
- UX: Display "Connection lost" with retry mechanism
- Action: Implement exponential backoff with manual retry option
- Logging: Monitor frequency and patterns of network failures

## 6. DATA FLOW BY USER STORY

### Login → Fetch Tasks
1. User authenticates through Better Auth
2. JWT token is stored securely
3. Dashboard loads and automatically fetches user's tasks
4. Tasks are displayed in the UI with loading states
5. Error handling for failed fetches with retry options

### Create Task
1. User fills out task creation form
2. Form validation occurs on frontend
3. POST request sent to /api/{user_id}/tasks with JWT authorization
4. Response handled with success/error feedback
5. Task list refreshed to show new task

### Update Task
1. User modifies task details in UI
2. Validation occurs before submission
3. PUT request sent to /api/{user_id}/tasks/{id} with JWT authorization
4. Response handled with success/error feedback
5. Task list updated with new information

### Complete Task
1. User toggles completion status
2. PATCH request sent to /api/{user_id}/tasks/{id}/complete with JWT authorization
3. Response handled with success/error feedback
4. UI updates completion status immediately

### Delete Task
1. User confirms deletion action
2. DELETE request sent to /api/{user_id}/tasks/{id} with JWT authorization
3. Response handled with success/error feedback
4. Task removed from UI

### Refresh Page with Existing Session
1. Application checks for existing authentication
2. Validates JWT token validity
3. Automatically fetches user's tasks if authenticated
4. Maintains UI state and displays appropriate content

## 7. SECURITY CONSIDERATIONS

### JWT Handling Risks
- Store tokens in memory when possible to prevent XSS access
- Use HttpOnly cookies only when persistence is required
- Implement automatic token refresh before expiration
- Sanitize all user inputs to prevent injection attacks

### XSS Considerations
- Never store sensitive tokens in localStorage
- Implement Content Security Policy headers
- Sanitize all user-generated content before rendering
- Use proper output encoding for dynamic content

### CSRF Stance
- Minimal concern due to JWT-based authentication
- Backend validates user identity on each request
- No reliance on session cookies that could be vulnerable
- JWT tokens are sent explicitly in headers rather than being automatically attached

### Environment Variable Exposure Rules
- BACKEND_API_BASE_URL is safe for client-side access
- BETTER_AUTH_SECRET remains server-side only
- No sensitive backend credentials exposed to frontend
- All configuration follows principle of least privilege

## 8. ACCEPTANCE CRITERIA

- [ ] Frontend successfully authenticates users via Better Auth and receives valid JWT tokens
- [ ] All API requests include proper Authorization header with Bearer token
- [ ] User isolation is enforced: users can only access their own tasks
- [ ] Token expiration is handled gracefully with automatic refresh or re-authentication
- [ ] All backend endpoints (GET, POST, PUT, DELETE, PATCH) function correctly from frontend
- [ ] Error responses (401, 403, 404, 500) are handled with appropriate UX
- [ ] User ID from JWT matches URL parameter for all requests
- [ ] Task CRUD operations work as expected with proper loading states
- [ ] Session persists across browser restarts when appropriate
- [ ] Logout clears all authentication data and prevents unauthorized access
- [ ] Network failures are handled with retry mechanisms and user feedback
- [ ] Security best practices are followed for JWT storage and transmission
- [ ] Frontend validates user identity before making requests to backend
- [ ] All API communication uses HTTPS in production environments

## OPEN QUESTIONS (BLOCKING vs NON-BLOCKING)

- [x] What specific error message content should be displayed to users for each error type? (RESOLVED: Default user-friendly messages defined in Error Handling section)
- [x] Are there specific performance requirements for API response times? (RESOLVED: Standard web app expectation of sub-2-second responses for API calls)
- [x] Should the frontend implement optimistic updates for better UX? (RESOLVED: Optimistic updates will be implemented for task completion and status changes for better UX)