/**
 * Mock API Handlers for Development
 * These handlers simulate the backend API for development when the actual backend is not available
 */

// In-memory storage for mock data
let mockTodos: any[] = [
  {
    id: '1',
    title: 'Sample Todo',
    description: 'This is a sample todo item',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user-1'
  },
  {
    id: '2',
    title: 'Another Todo',
    description: 'This is another sample todo item',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user-1'
  }
];

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApiHandlers = {
  // Get all todos
  getTodos: async (): Promise<any[]> => {
    await delay(300); // Simulate network delay
    return [...mockTodos];
  },

  // Get todo by ID
  getTodoById: async (id: string): Promise<any> => {
    await delay(300);
    const todo = mockTodos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return { ...todo };
  },

  // Create a new todo
  createTodo: async (todoData: any): Promise<any> => {
    await delay(500);
    const newTodo = {
      id: generateId(),
      title: todoData.title,
      description: todoData.description || '',
      completed: todoData.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'mock-user-1' // In a real app, this would come from the authenticated user
    };
    mockTodos.push(newTodo);
    return { ...newTodo };
  },

  // Update a todo
  updateTodo: async (id: string, todoData: any): Promise<any> => {
    await delay(500);
    const index = mockTodos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...mockTodos[index],
      ...todoData,
      updatedAt: new Date().toISOString()
    };

    mockTodos[index] = updatedTodo;
    return { ...updatedTodo };
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await delay(500);
    mockTodos = mockTodos.filter(t => t.id !== id);
  },

  // Toggle completion status
  toggleTodoCompletion: async (id: string): Promise<any> => {
    await delay(300);
    const index = mockTodos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...mockTodos[index],
      completed: !mockTodos[index].completed,
      updatedAt: new Date().toISOString()
    };

    mockTodos[index] = updatedTodo;
    return { ...updatedTodo };
  }
};

// Export a function to conditionally use mock API based on environment
export const getApiImplementation = () => {
  // Use mock API in development when actual backend is not available
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
                 process.env.NODE_ENV === 'development' &&
                 !process.env.NEXT_PUBLIC_API_BASE_URL;

  if (useMock) {
    return mockApiHandlers;
  }

  // In other cases, return the real API client
  // This would be handled by the main api-client.ts
  return null;
};