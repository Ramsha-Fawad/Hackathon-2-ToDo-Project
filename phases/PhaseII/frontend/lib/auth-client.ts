"use client";

import { createAuthClient } from 'better-auth/client';
import { AppConfig } from './config';

// Initialize the Better Auth client with the backend API URL
export const authClient = createAuthClient({
  baseURL: AppConfig.BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Ensure cookies are sent with requests
});

export default authClient;