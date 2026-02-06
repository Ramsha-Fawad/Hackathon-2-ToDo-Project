/**
 * Task-specific operations hook for the frontend application
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import { useApi } from './useApi';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/tasks';

interface UseTasksReturn {
  tasks: Task[];
  loading: {
    fetchTasks: boolean;
    createTask: boolean;
    updateTask: boolean;
    deleteTask: boolean;
    completeTask: boolean;
  };
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: string, taskData: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const { authState } = useAuth();
  const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error
  } = useApi();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentUserId = authState.token?.userId;

  // Fetch tasks when user is authenticated
  const fetchTasks = useCallback(async () => {
    if (!currentUserId || !authState.isAuthenticated) {
      setTasks([]);
      return;
    }

    try {
      const response = await getTasks(currentUserId);
      console.log('getTasks response:', response);
      console.log('getTasks response type:', typeof response);
      console.log('getTasks response is array:', Array.isArray(response));
      console.log('getTasks response length:', Array.isArray(response) ? response.length : 'not array');

      // Ensure response is always an array
      setTasks(Array.isArray(response) ? response : []);
      console.log('tasks state after update:', Array.isArray(response) ? response.length : 0);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Don't clear existing tasks on error to prevent false empty state
      // The error will be reflected in the error state from useApi
      // This prevents the UI from showing "No Tasks" when there's actually an auth issue
    }
  }, [currentUserId, authState.isAuthenticated, getTasks]);

  // Refresh tasks after operations
  const refetch = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const createTaskWrapper = useCallback(
    async (taskData: CreateTaskRequest) => {
      if (!currentUserId || !authState.isAuthenticated) {
        throw new Error('User not authenticated');
      }

      try {
        const response = await createTask(currentUserId, taskData);

        // After successful creation, refetch tasks to ensure data consistency
        await fetchTasks();
      } catch (err) {
        console.error('Error creating task:', err);
        // Error is already handled by useApi hook
        throw err;
      }
    },
    [currentUserId, authState.isAuthenticated, createTask, fetchTasks]
  );

  // Update a task
  const updateTaskWrapper = useCallback(
    async (taskId: string, taskData: UpdateTaskRequest) => {
      if (!currentUserId || !authState.isAuthenticated) {
        throw new Error('User not authenticated');
      }

      try {
        const response = await updateTask(currentUserId, taskId, taskData);

        // Update the task in the list
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? response : task
          )
        );
      } catch (err) {
        console.error('Error updating task:', err);
        // Error is already handled by useApi hook
        throw err;
      }
    },
    [currentUserId, authState.isAuthenticated, updateTask]
  );

  // Delete a task
  const deleteTaskWrapper = useCallback(
    async (taskId: string) => {
      if (!currentUserId || !authState.isAuthenticated) {
        throw new Error('User not authenticated');
      }

      try {
        const success = await deleteTask(currentUserId, taskId);

        if (success) {
          // Remove the task from the list
          setTasks(prev => prev.filter(task => task.id !== taskId));
        }
      } catch (err) {
        console.error('Error deleting task:', err);
        // Error is already handled by useApi hook
        throw err;
      }
    },
    [currentUserId, authState.isAuthenticated, deleteTask]
  );

  // Toggle task completion
  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      if (!currentUserId || !authState.isAuthenticated) {
        throw new Error('User not authenticated');
      }

      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      try {
        // Toggle the current completion status
        const newCompletedStatus = !task.completed;
        const response = await completeTask(currentUserId, taskId, newCompletedStatus);

        // Update the task in the list
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId ? response : t
          )
        );
      } catch (err) {
        console.error('Error toggling task completion:', err);
        // Error is already handled by useApi hook
        throw err;
      }
    },
    [currentUserId, authState.isAuthenticated, tasks, completeTask]
  );

  // Effect to fetch tasks when user becomes authenticated
  useEffect(() => {
    if (authState.isAuthenticated && currentUserId && !isInitialized) {
      fetchTasks().then(() => setIsInitialized(true));
    }
  }, [authState.isAuthenticated, currentUserId, fetchTasks, isInitialized]);

  // Effect to refetch when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && currentUserId) {
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks when user logs out
    }
  }, [authState.isAuthenticated, currentUserId, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask: createTaskWrapper,
    updateTask: updateTaskWrapper,
    deleteTask: deleteTaskWrapper,
    toggleTaskCompletion,
    refetch,
  };
};