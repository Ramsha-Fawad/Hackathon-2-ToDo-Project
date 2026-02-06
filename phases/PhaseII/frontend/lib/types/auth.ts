/**
 * Authentication-related TypeScript type definitions
 */

export interface AuthToken {
  /** JWT token string */
  token: string;
  /** Token expiration timestamp */
  expiresAt: number;
  /** Associated user ID */
  userId: string;
}

export interface AuthState {
  /** Current authentication token */
  token: AuthToken | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Loading state for auth operations */
  isLoading: boolean;
  /** Any auth-related error */
  error: string | null;
}

export interface UserProfile {
  /** User's unique ID */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  username: string;
  /** Account creation timestamp */
  created_at: string;
}

export interface LoginCredentials {
  /** User email */
  email: string;
  /** User password */
  password: string;
}

export interface RegisterCredentials {
  /** User email */
  email: string;
  /** User password */
  password: string;
  /** User name */
  name: string;
}

export interface ApiError {
  /** Error message */
  message: string;
  /** Optional error code */
  code?: string;
  /** Optional error details */
  details?: Record<string, unknown>;
}