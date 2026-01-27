from fastapi import HTTPException, status


class TaskNotFoundException(HTTPException):
    """
    Exception raised when a task is not found.
    """
    def __init__(self, task_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )


class UserNotAuthorizedException(HTTPException):
    """
    Exception raised when a user is not authorized to access a resource.
    """
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )


class InvalidCredentialsException(HTTPException):
    """
    Exception raised when credentials are invalid.
    """
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


class ExpiredTokenException(HTTPException):
    """
    Exception raised when a token has expired.
    """
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )


class ValidationErrorException(HTTPException):
    """
    Exception raised when validation fails.
    """
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )


class BadRequestException(HTTPException):
    """
    Exception raised for bad requests.
    """
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )