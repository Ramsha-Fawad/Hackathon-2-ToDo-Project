/**
 * Authentication utility functions for the frontend
 */

import TokenManager from './token-manager';

/**
 * Extract user ID from JWT token payload
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = TokenManager.decodeTokenPayload(token);
    if (payload && payload.user_id) {
      return payload.user_id;
    }
    // Some JWT implementations use 'sub' for subject/user ID
    if (payload && payload.sub) {
      return payload.sub;
    }
    return null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}

/**
 * Validate that the URL user_id matches the JWT token's user_id
 */
export function validateUserIdMatch(urlUserId: string, token: string): boolean {
  const tokenUserId = getUserIdFromToken(token);
  return tokenUserId !== null && tokenUserId === urlUserId;
}

/**
 * Get current authenticated user ID from stored token
 */
export function getCurrentUserId(): string | null {
  return TokenManager.getUserId();
}

/**
 * Check if current session is valid
 */
export function isAuthenticated(): boolean {
  return TokenManager.isValid();
}

/**
 * Check if token is about to expire
 */
export function isTokenAboutToExpire(): boolean {
  return TokenManager.isAboutToExpire();
}

/**
 * Extract and validate user role from token (if roles are implemented)
 */
export function getUserRoleFromToken(token: string): string | null {
  try {
    const payload = TokenManager.decodeTokenPayload(token);
    if (payload && payload.role) {
      return payload.role;
    }
    if (payload && payload.roles && Array.isArray(payload.roles)) {
      return payload.roles[0];
    }
    return null;
  } catch (error) {
    console.error('Error extracting user role from token:', error);
    return null;
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(token: string, roleName: string): boolean {
  const userRole = getUserRoleFromToken(token);
  return userRole === roleName;
}

/**
 * Get token expiration timestamp
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = TokenManager.decodeTokenPayload(token);
    if (payload && payload.exp) {
      // Convert seconds to milliseconds
      return payload.exp * 1000;
    }
    return null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiration(token);
  if (exp === null) {
    return true; // Consider invalid tokens as expired
  }
  return Date.now() >= exp;
}