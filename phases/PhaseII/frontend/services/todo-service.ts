import { apiGet, apiPost, apiPut, apiDelete, validateRequest, validateResponse } from '../lib/api-client';

// Define TypeScript interfaces for Todo operations
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Request validation schemas
const isValidCreateTodoInput = (data: unknown): data is CreateTodoInput => {
  if (!data || typeof data !== 'object') return false;
  const input = data as CreateTodoInput;
  return typeof input.title === 'string' && input.title.trim().length > 0;
};

const isValidUpdateTodoInput = (data: unknown): data is UpdateTodoInput => {
  if (!data || typeof data !== 'object') return false;
  const input = data as UpdateTodoInput;
  return (
    (input.title === undefined || typeof input.title === 'string') &&
    (input.description === undefined || typeof input.description === 'string') &&
    (input.completed === undefined || typeof input.completed === 'boolean')
  );
};

// Response validation schemas
const isValidTodo = (data: unknown): data is Todo => {
  if (!data || typeof data !== 'object') return false;
  const todo = data as Todo;
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'string' &&
    typeof todo.updatedAt === 'string' &&
    typeof todo.userId === 'string'
  );
};

const isValidTodoArray = (data: unknown): data is Todo[] => {
  if (!Array.isArray(data)) return false;
  return data.every(isValidTodo);
};

// Todo Service API functions
export const todoService = {
  /**
   * Get all todos for the authenticated user
   */
  getAll: async (key?: string): Promise<Todo[]> => {
    try {
      const data = await apiGet<Todo[]>('/api/todos', undefined, key);
      return validateResponse(data, isValidTodoArray);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  /**
   * Get a specific todo by ID
   */
  getById: async (id: string, key?: string): Promise<Todo> => {
    try {
      const data = await apiGet<Todo>(`/api/todos/${id}`, undefined, key);
      return validateResponse(data, isValidTodo);
    } catch (error) {
      console.error(`Error fetching todo with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new todo
   */
  create: async (todoData: CreateTodoInput, key?: string): Promise<Todo> => {
    try {
      // Validate the input before sending
      validateRequest(todoData, isValidCreateTodoInput);

      const data = await apiPost<Todo>('/api/todos', todoData, undefined, key);
      return validateResponse(data, isValidTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  /**
   * Update an existing todo
   */
  update: async (id: string, todoData: UpdateTodoInput, key?: string): Promise<Todo> => {
    try {
      // Validate the input before sending
      validateRequest(todoData, isValidUpdateTodoInput);

      const data = await apiPut<Todo>(`/api/todos/${id}`, todoData, undefined, key);
      return validateResponse(data, isValidTodo);
    } catch (error) {
      console.error(`Error updating todo with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a todo
   */
  delete: async (id: string, key?: string): Promise<void> => {
    try {
      await apiDelete(`/api/todos/${id}`, undefined, key);
    } catch (error) {
      console.error(`Error deleting todo with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle completion status of a todo
   */
  toggleCompletion: async (id: string, key?: string): Promise<Todo> => {
    try {
      // First get the current todo to get its current state
      const currentTodo = await todoService.getById(id);

      // Update the completion status
      const updatedData: UpdateTodoInput = {
        completed: !currentTodo.completed
      };

      const data = await apiPut<Todo>(`/api/todos/${id}`, updatedData, undefined, key);
      return validateResponse(data, isValidTodo);
    } catch (error) {
      console.error(`Error toggling completion for todo with id ${id}:`, error);
      throw error;
    }
  }
};

// Export convenience hooks or utilities if needed
export const useTodoService = () => {
  return todoService;
};