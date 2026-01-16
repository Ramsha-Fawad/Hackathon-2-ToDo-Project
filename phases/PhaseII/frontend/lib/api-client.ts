import { redirect } from 'next/navigation';

/**
 * API Client Utility for handling authenticated requests with JWT tokens
 * This utility centralizes API request handling with proper authentication,
 * error handling, loading state management, and offline state handling.
 */

// Utility function to get the auth token from cookies
// Since we're using Better Auth with httpOnly cookies, we rely on the cookies
// being automatically attached to requests by the browser
async function getAuthToken(): Promise<string | null> {
  try {
    // In a real implementation with Better Auth, the JWT is stored in httpOnly cookies
    // and automatically sent with requests. We'll check if we're in the browser
    // and potentially get token from a secure context if needed.
    if (typeof window !== 'undefined') {
      // For client-side, we might have a temporary token in memory or session storage
      // but for httpOnly cookies, we rely on the browser to handle them
      return localStorage.getItem('auth-token');
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Loading state management
const loadingStates: Map<string, boolean> = new Map();

export function setLoadingState(key: string, loading: boolean) {
  loadingStates.set(key, loading);
}

export function getLoadingState(key: string): boolean {
  return loadingStates.get(key) ?? false;
}

// Offline state detection
export function isOnline(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true; // Assume online if we can't detect
}

// Response validation helper
export function validateResponse<T>(data: unknown, schema?: (data: unknown) => data is T): T {
  if (schema && !schema(data)) {
    throw new Error('Response validation failed');
  }
  return data as T;
}

// Main API client with interceptors and error handling
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  key?: string
): Promise<T> {
  // Set loading state if key is provided
  if (key) {
    setLoadingState(key, true);
  }

  try {
    // Check if we're online before making the request
    if (typeof window !== 'undefined' && !navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    // Get auth token if needed (for cases where we need to manually attach it)
    const token = await getAuthToken();

    // Configure request with proper headers and credentials
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Attach Authorization header if we have a token
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      // Include credentials to ensure httpOnly cookies are sent with requests
      credentials: 'include',
      ...options,
    };

    // Make the request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${endpoint}`, config);

    // Handle 401/403 responses by redirecting to login
    if (response.status === 401 || response.status === 403) {
      // Clear any local token if present
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');

        // Store the current location to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);

        // Redirect to login page
        window.location.href = '/login';
      }

      // In server components, use Next.js redirect
      if (typeof window === 'undefined') {
        redirect('/login');
      }

      throw new Error('Unauthorized: Please log in again');
    }

    // Parse response
    let data;
    if (response.status === 204) {
      // No content response
      data = {};
    } else {
      data = await response.json();
    }

    // Throw error if response is not ok
    if (!response.ok) {
      throw new Error(data?.message || `API request failed: ${response.statusText}`);
    }

    return data as T;
  } catch (error) {
    // Check if it's a network error (likely offline)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    // Log the error for debugging
    console.error(`API request error for ${endpoint}:`, error);

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during the API request');
  } finally {
    // Clear loading state if key is provided
    if (key) {
      setLoadingState(key, false);
    }
  }
}

// Specific HTTP method helpers
export const apiGet = <T>(endpoint: string, options?: RequestInit, key?: string) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' }, key);

export const apiPost = <T>(endpoint: string, body: any, options?: RequestInit, key?: string) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }, key);

export const apiPut = <T>(endpoint: string, body: any, options?: RequestInit, key?: string) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }, key);

export const apiDelete = <T>(endpoint: string, options?: RequestInit, key?: string) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' }, key);

// Request validation helper
export function validateRequest<T>(data: T, schema?: (data: T) => boolean): void {
  if (schema && !schema(data)) {
    throw new Error('Request validation failed');
  }
}

// Error handling utility
export function handleApiError(error: unknown): { message: string; status?: number } {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unknown error occurred' };
}

// Online/offline event listeners for UI updates
export function addOnlineOfflineListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }

  // Return noop if not in browser
  return () => {};
}