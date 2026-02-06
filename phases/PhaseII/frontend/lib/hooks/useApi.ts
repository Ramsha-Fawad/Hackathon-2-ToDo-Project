/**
 * API interaction hook for the frontend application
 */

import { useState, useCallback } from 'react';
import apiClient from '../api/api-client';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/tasks';

interface UseApiReturn {
  // Task-related methods
  getTasks: (userId: string) => Promise<Task[]>;
  getTaskById: (userId: string, taskId: string) => Promise<Task>;
  createTask: (userId: string, taskData: CreateTaskRequest) => Promise<Task>;
  updateTask: (userId: string, taskId: string, taskData: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (userId: string, taskId: string) => Promise<boolean>;
  completeTask: (userId: string, taskId: string, completed: boolean) => Promise<Task>;
  // Profile-related methods
  getUserProfile: () => Promise<any>;

  // Loading states
  loading: {
    getTasks: boolean;
    createTask: boolean;
    updateTask: boolean;
    deleteTask: boolean;
    completeTask: boolean;
  };

  // Error states
  error: string | null;
}

export const useApi = (): UseApiReturn => {
  // Loading states for different API operations
  const [loadingStates, setLoadingStates] = useState({
    getTasks: false,
    createTask: false,
    updateTask: false,
    deleteTask: false,
    completeTask: false,
  });

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Reset error when starting a new operation
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Wrapper function to handle loading states and errors
  const withLoadingAndErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      loadingKey: keyof typeof loadingStates
    ): Promise<T> => {
      resetError();

      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: true,
      }));

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoadingStates(prev => ({
          ...prev,
          [loadingKey]: false,
        }));
      }
    },
    [resetError]
  );

  // Task-related methods
  const getTasks = useCallback(
    async (userId: string) => {
      return withLoadingAndErrorHandling(
        () => apiClient.getTasks(userId),
        'getTasks'
      );
    },
    [withLoadingAndErrorHandling]
  );

  const getTaskById = useCallback(
    async (userId: string, taskId: string) => {
      return withLoadingAndErrorHandling(
        () => apiClient.getTaskById(userId, taskId),
        'getTasks'
      );
    },
    [withLoadingAndErrorHandling]
  );

  const createTask = useCallback(
    async (userId: string, taskData: CreateTaskRequest) => {
      return withLoadingAndErrorHandling(
        () => apiClient.createTask(userId, taskData),
        'createTask'
      );
    },
    [withLoadingAndErrorHandling]
  );

  const updateTask = useCallback(
    async (userId: string, taskId: string, taskData: UpdateTaskRequest) => {
      return withLoadingAndErrorHandling(
        () => apiClient.updateTask(userId, taskId, taskData),
        'updateTask'
      );
    },
    [withLoadingAndErrorHandling]
  );

  const deleteTask = useCallback(
    async (userId: string, taskId: string) => {
      return withLoadingAndErrorHandling(
        () => apiClient.deleteTask(userId, taskId),
        'deleteTask'
      );
    },
    [withLoadingAndErrorHandling]
  );

  const completeTask = useCallback(
    async (userId: string, taskId: string, completed: boolean) => {
      return withLoadingAndErrorHandling(
        () => apiClient.completeTask(userId, taskId, completed),
        'completeTask'
      );
    },
    [withLoadingAndErrorHandling]
  );


  const getUserProfile = useCallback(
    async () => {
      return withLoadingAndErrorHandling(
        () => apiClient.getUserProfile(),
        'getTasks' // Reusing getTasks loading state for profile loading
      );
    },
    [withLoadingAndErrorHandling]
  );

  return {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getUserProfile,
    loading: loadingStates,
    error,
  };
};