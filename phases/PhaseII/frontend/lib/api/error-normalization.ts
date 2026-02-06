/**
 * Standardized error objects for API responses
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  fieldErrors?: Record<string, string[]>;
}

/**
 * Normalize different types of errors into a standard format
 */
export function normalizeError(error: any): ApiError {
  if (error instanceof Error) {
    // Standard JavaScript Error
    return {
      message: error.message,
      code: error.name,
    };
  }

  if (typeof error === 'string') {
    // String error
    return {
      message: error,
    };
  }

  if (error && typeof error === 'object') {
    // Object with error properties
    if (error.message) {
      return {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details,
      };
    }

    // Response-like object
    if (error.status && error.statusText) {
      return {
        message: error.statusText,
        status: error.status,
        details: error.data || error.body,
      };
    }
  }

  // Unknown error type
  return {
    message: 'An unknown error occurred',
    details: error,
  };
}

/**
 * Create a standardized error for specific HTTP status codes
 */
export function createHttpError(status: number, message?: string): ApiError {
  const statusMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  return {
    message: message || statusMessages[status] || `HTTP Error ${status}`,
    status: status,
    code: `HTTP_${status}`,
  };
}

/**
 * Check if an error is a specific HTTP error
 */
export function isHttpError(error: ApiError, status: number): boolean {
  return error.status === status;
}

/**
 * Check if an error is a client error (4xx)
 */
export function isClientError(error: ApiError): boolean {
  return error.status !== undefined && error.status >= 400 && error.status < 500;
}

/**
 * Check if an error is a server error (5xx)
 */
export function isServerError(error: ApiError): boolean {
  return error.status !== undefined && error.status >= 500 && error.status < 600;
}

/**
 * Create a validation error with field-specific errors
 */
export function createValidationError(
  message: string,
  fieldErrors?: Record<string, string[]>
): ValidationError {
  return {
    message,
    code: 'VALIDATION_ERROR',
    status: 422,
    fieldErrors,
  };
}

/**
 * Parse error response from API
 */
export function parseApiError(response: Response, responseBody?: any): ApiError {
  const status = response.status;
  const statusText = response.statusText;

  // Try to get error details from response body
  let message = statusText;
  let details: Record<string, unknown> | undefined;

  if (responseBody && typeof responseBody === 'object') {
    if (responseBody.message) {
      message = responseBody.message;
    }
    if (responseBody.error) {
      message = responseBody.error;
    }
    details = responseBody;
  }

  return {
    message,
    status,
    code: `HTTP_${status}`,
    details,
  };
}