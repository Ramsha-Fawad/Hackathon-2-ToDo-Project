/**
 * Task-related TypeScript type definitions
 */

export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Title of the task */
  title: string;
  /** Optional description of the task */
  description?: string;
  /** Whether the task is completed */
  completed: boolean;
  /** Date when the task was created */
  createdAt: string;
  /** Date when the task was last updated */
  updatedAt: string;
  /** ID of the user who owns this task */
  userId: string;
}

export interface CreateTaskRequest {
  /** Title of the new task */
  title: string;
  /** Optional description of the new task */
  description?: string;
}

export interface UpdateTaskRequest {
  /** Optional new title for the task */
  title?: string;
  /** Optional new description for the task */
  description?: string;
  /** Optional new completion status */
  completed?: boolean;
}

export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Whether the request was successful */
  success: boolean;
  /** Optional message */
  message?: string;
}

export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Total number of items */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
}