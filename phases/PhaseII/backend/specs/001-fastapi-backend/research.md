# Research Summary: Phase II Backend – Todo API Service

## Technology Decisions

### JWT Implementation
- **Decision**: PyJWT with HS256 algorithm
- **Rationale**: Standard symmetric algorithm that balances security and simplicity for this use case. HS256 is widely supported and appropriate for service-to-service authentication.
- **Alternatives considered**:
  - RS256: More complex asymmetric approach requiring public/private key management
  - None/weak algorithms: Insecure and not recommended

### Database Connection Strategy
- **Decision**: Connection pooling with SSL enforcement
- **Rationale**: Ensures performance and security for production deployment. Connection pooling reduces overhead of creating new connections and SSL provides encrypted communication.
- **Alternatives considered**:
  - Direct connections without pooling: Would lead to performance issues under load
  - Connection pooling without SSL: Would compromise security

### Validation Rules
- **Decision**: Title 1-100 characters, description optional up to 1000 characters
- **Rationale**: Standard validation that prevents abuse while allowing flexibility. Prevents extremely long inputs that could impact performance or storage.
- **Alternatives considered**:
  - Different character limits: Various combinations evaluated based on typical use cases

### Error Response Format
- **Decision**: JSON with message and error code
- **Rationale**: Follows REST API best practices and is easily consumable by frontend applications. Provides structured information for error handling.
- **Alternatives considered**:
  - Plain text: Less structured and harder to parse programmatically
  - HTML: Not appropriate for API responses

### Token Expiry and Clock Skew
- **Decision**: 15 minute expiry with 5 minute clock skew tolerance
- **Rationale**: Balances security with usability for typical web applications. Shorter expiry reduces exposure window while 5 minute skew handles timing differences.
- **Alternatives considered**:
  - Longer/shorter expiry: Evaluated based on security requirements vs user experience