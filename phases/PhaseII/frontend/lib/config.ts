/**
 * Configuration settings for the frontend application
 */

export const AppConfig = {
  // Base URL for the backend API
  BACKEND_API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000',

  // Token expiration threshold (in milliseconds) - refresh token when it expires in less than this time
  TOKEN_EXPIRATION_THRESHOLD: 5 * 60 * 1000, // 5 minutes

  // Default timeout for API requests (in milliseconds)
  DEFAULT_REQUEST_TIMEOUT: 10000, // 10 seconds

  // Retry settings for failed requests
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Pagination settings
  DEFAULT_PAGE_SIZE: 20,

  // Cache settings
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

export type AppConfigType = typeof AppConfig;