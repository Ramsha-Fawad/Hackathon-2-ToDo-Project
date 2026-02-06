/**
 * Request and response interceptors for the API client
 */

import TokenManager from '../auth/token-manager';
import { validateUserIdMatch } from '../auth/auth-utils';
import { normalizeError, createHttpError, parseApiError } from './error-normalization';

interface InterceptorConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: any;
}

interface ApiResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
}

/**
 * Request interceptor to add authentication headers and validate user ID
 */
export function requestInterceptor(config: InterceptorConfig): InterceptorConfig {
  // Get JWT token from localStorage
  const token = TokenManager.getToken();

  // Add Authorization header if token exists and this is not an auth endpoint
  if (token && !config.url.includes('/api/auth/')) {
    config.headers['Authorization'] = `Bearer ${token.token}`;
  }

  // Check if this is a user-specific endpoint that requires user ID validation
  const userIdMatch = extractUserIdFromUrl(config.url);
  if (userIdMatch && token) {
    const urlUserId = userIdMatch[1];
    const isValid = validateUserIdMatch(urlUserId, token.token);

    if (!isValid) {
      throw new Error(`User ID mismatch: URL user ID does not match token user ID`);
    }
  }

  // Add Content-Type header for POST/PUT/PATCH requests if not already set
  if ((config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}

/**
 * Response interceptor to handle different status codes
 */
export function responseInterceptor(response: ApiResponse): ApiResponse {
  // Log successful responses for debugging
  console.log(`API Response: ${response.status}`, response.data);
  console.log(`API Response type:`, typeof response.data);
  console.log(`API Response array check:`, Array.isArray(response.data));

  return response;
}

/**
 * Error interceptor to handle different error types
 */
export function errorInterceptor(error: any): Promise<never> {
  if (error.response) {
    // Server responded with error status
    const response = error.response;

    switch (response.status) {
      case 401:
        console.error('Unauthorized access - token may be expired or invalid');
        // Clear token and redirect to login (in a real app, you'd use router)
        TokenManager.clearToken();

        // Attempt to redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        break;
      case 403:
        console.error('Forbidden access - insufficient permissions');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error occurred');
        break;
      default:
        console.error(`HTTP Error: ${response.status} - ${response.data?.message || 'Unknown error'}`);
    }

    // Parse and normalize the API error
    const apiError = parseApiError(
      { status: response.status, statusText: '' } as Response,
      response.data
    );

    return Promise.reject(apiError);
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network error - no response received');
    return Promise.reject(createHttpError(0, 'Network error - no response received'));
  } else {
    // Something else happened
    console.error('Request error:', error.message);
    return Promise.reject(normalizeError(error));
  }
}

/**
 * Helper function to extract user ID from URL
 * Matches patterns like /api/{user_id}/tasks, /api/{user_id}/tasks/{id}, etc.
 */
function extractUserIdFromUrl(url: string): RegExpMatchArray | null {
  // Match patterns like /api/{userId}/tasks (extracts the userId part)
  // More flexible to handle different path structures
  const userIdPattern = /\/api\/([^\/]+)\/tasks/;
  return url.match(userIdPattern);
}