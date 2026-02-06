/**
 * API endpoint definitions for the Todo application
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile',
  },
  TASKS: {
    BASE: '/api/:userId/tasks',
    GET_ALL: '/api/:userId/tasks',
    GET_BY_ID: (id: string) => `/api/:userId/tasks/${id}`,
    CREATE: '/api/:userId/tasks',
    UPDATE: (id: string) => `/api/:userId/tasks/${id}`,
    DELETE: (id: string) => `/api/:userId/tasks/${id}`,
    COMPLETE: (id: string) => `/api/:userId/tasks/${id}/complete`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;