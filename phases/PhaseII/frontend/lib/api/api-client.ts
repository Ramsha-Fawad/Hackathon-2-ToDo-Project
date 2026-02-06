/**
 * Centralized API client with interceptors for header injection and error handling
 */

import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';
import { API_ENDPOINTS } from './endpoints';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types/tasks';
import { AppConfig } from '../config';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AppConfig.BACKEND_API_BASE_URL;
  }

  /**
   * Make an API request with interceptors
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params } = options;

    // Construct URL with base URL and endpoint
    let url = `${this.baseUrl}${endpoint}`;

    // Add query parameters if provided
    if (params) {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      url += `?${queryString}`;
    }

    // Prepare initial config
    let config = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: body,
    };

    try {
      // Apply request interceptor
      config = requestInterceptor(config);

      // Make the fetch request
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        credentials: 'include', // Ensure cookies are sent with requests
      });

      // Clone the response to handle it properly
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // If response is not JSON, create a basic response object
        responseData = { message: await response.text() || 'Response is not in JSON format' };
      }

      // Check if the response indicates success
      if (!response.ok) {
        // Create an error response object to pass to the error interceptor
        const errorResponse = {
          data: responseData,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        };

        // Call error interceptor
        throw { response: errorResponse, request: config };
      }

      // Create response object for interceptor
      // If response data has a 'data' property, use it, otherwise use the whole response
      // Also handle potential nested response formats
      let extractedData = responseData;
      if (responseData && typeof responseData === 'object') {
        if ('data' in responseData) {
          extractedData = responseData.data;
        } else if ('result' in responseData) {
          extractedData = responseData.result;
        } else if ('items' in responseData) {
          extractedData = responseData.items;
        }
      }

      const apiResponse = {
        data: extractedData,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      };

      // Apply response interceptor
      const processedResponse = responseInterceptor(apiResponse);

      return processedResponse.data as T;
    } catch (error) {
      // Apply error interceptor
      return await errorInterceptor(error);
    }
  }

  // Task-related API methods

  /**
   * Get all tasks for a specific user
   */
  async getTasks(userId: string): Promise<Task[]> {
    const endpoint = API_ENDPOINTS.TASKS.GET_ALL.replace(':userId', userId);
    const response = await this.request<Task[]>(endpoint);
    return response;
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(userId: string, taskId: string): Promise<Task> {
    const endpoint = API_ENDPOINTS.TASKS.GET_BY_ID(taskId).replace(':userId', userId);
    const response = await this.request<Task>(endpoint);
    return response;
  }

  /**
   * Create a new task
   */
  async createTask(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    const endpoint = API_ENDPOINTS.TASKS.CREATE.replace(':userId', userId);
    // Include the userId in the task data to match backend expectations
    const taskDataWithUserId = {
      ...taskData,
      user_id: userId
    };
    const response = await this.request<Task>(endpoint, {
      method: 'POST',
      body: taskDataWithUserId,
    });
    return response;
  }

  /**
   * Update a task
   */
  async updateTask(userId: string, taskId: string, taskData: UpdateTaskRequest): Promise<Task> {
    const endpoint = API_ENDPOINTS.TASKS.UPDATE(taskId).replace(':userId', userId);
    const response = await this.request<Task>(endpoint, {
      method: 'PUT',
      body: taskData,
    });
    return response;
  }

  /**
   * Delete a task
   */
  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const endpoint = API_ENDPOINTS.TASKS.DELETE(taskId).replace(':userId', userId);
    const response = await this.request<{success: boolean}>(endpoint, {
      method: 'DELETE',
    });
    return response.success;
  }

  /**
   * Complete a task
   */
  async completeTask(userId: string, taskId: string, completed: boolean): Promise<Task> {
    const endpoint = API_ENDPOINTS.TASKS.COMPLETE(taskId).replace(':userId', userId);
    const response = await this.request<Task>(endpoint, {
      method: 'PATCH',
      body: { completed },
    });
    return response;
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<any> {
    const endpoint = API_ENDPOINTS.AUTH.PROFILE;
    const response = await this.request<any>(endpoint);
    return response.data;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;