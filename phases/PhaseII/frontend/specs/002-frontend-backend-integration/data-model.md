# Data Model: Frontend-Backend Integration

## Authentication Data

### JWT Token
- **token**: String
  - Purpose: JWT authentication token received from Better Auth
  - Structure: Standard JWT with HS256 algorithm
  - Claims: Contains user_id and expiration time
  - Storage: Memory-first with HttpOnly cookie fallback

### User Identity
- **user_id**: String
  - Purpose: Unique identifier from authentication system
  - Source: Extracted from JWT token claims
  - Validation: Must match format expected by backend
  - Constraints: Required for all authenticated operations

### Session State
- **isAuthenticated**: Boolean
  - Purpose: Indicates current authentication status
  - Source: Token validity check
  - Constraints: True only when valid JWT exists

- **expiresAt**: DateTime
  - Purpose: Token expiration timestamp
  - Source: JWT exp claim
  - Constraints: Used for proactive refresh

## API Request/Response Models

### API Client Configuration
- **baseUrl**: String
  - Purpose: Base URL for backend API requests
  - Source: Environment variable (BACKEND_API_BASE_URL)
  - Validation: Must be a valid URL format

### Request Headers
- **Authorization**: String
  - Purpose: Bearer token for authentication
  - Format: "Bearer {jwt_token}"
  - Source: Current JWT token from storage

- **ContentType**: String
  - Purpose: Content type for request body
  - Value: "application/json"
  - Applied to: POST, PUT, PATCH requests

## Error Response Model

### Standardized Error Object
- **status**: Number
  - Purpose: HTTP status code
  - Values: 401, 403, 404, 500, etc.

- **message**: String
  - Purpose: User-friendly error message
  - Source: Mapped from HTTP status or backend error

- **timestamp**: DateTime
  - Purpose: Time when error occurred
  - Source: Client-side timestamp

## Cache Data Model

### Request/Response Cache
- **requestKey**: String
  - Purpose: Unique identifier for cached request
  - Format: Method + URL + params

- **response**: Object
  - Purpose: Cached API response
  - TTL: Configurable cache duration

- **lastUpdated**: DateTime
  - Purpose: Cache entry timestamp
  - Used for: Cache invalidation