from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import uvicorn
from .database import init_database
from .api.v1.tasks import router as tasks_router
from .api.v1.auth import router as auth_router
from .utils.exceptions import (
    TaskNotFoundException, UserNotAuthorizedException,
    InvalidCredentialsException, ExpiredTokenException,
    ValidationErrorException, BadRequestException
)

app = FastAPI(
    title="Todo API Service",
    version="1.0.0",
    description="Secure, authenticated REST API for multi-user Todo application with JWT authentication",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include API routes
app.include_router(tasks_router)
app.include_router(auth_router)

# Global exception handlers
@app.exception_handler(TaskNotFoundException)
async def task_not_found_handler(request: Request, exc: TaskNotFoundException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(UserNotAuthorizedException)
async def user_not_authorized_handler(request: Request, exc: UserNotAuthorizedException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(InvalidCredentialsException)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(ExpiredTokenException)
async def expired_token_handler(request: Request, exc: ExpiredTokenException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(ValidationErrorException)
async def validation_error_handler(request: Request, exc: ValidationErrorException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(BadRequestException)
async def bad_request_handler(request: Request, exc: BadRequestException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.on_event("startup")
def on_startup():
    """Initialize the database when the application starts."""
    init_database()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API Service"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)