from fastapi import Depends, HTTPException, status
from typing import Annotated
from ..deps import get_current_user
from fastapi import APIRouter
from sqlmodel import Session
from typing import Optional
from ...models.task import User
from ...schemas.auth import Token
from ...database.session import get_session
from ...utils.auth import create_access_token
from pydantic import BaseModel
from datetime import timedelta, datetime
import uuid


async def validate_user_id(user_id: str, current_user_id: str = Depends(get_current_user)):
    """
    Authorization guard to validate that the user_id in the URL matches
    the user_id in the JWT token.

    This function enforces user isolation by ensuring that users can only
    access resources that belong to their own account.

    Args:
        user_id: The user_id from the URL path parameter
        current_user_id: The user_id extracted from the JWT token (via dependency)

    Returns:
        The validated user_id if it matches the token's user_id

    Raises:
        HTTPException: If user_ids don't match (returns 403 Forbidden)
    """
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: user_id in URL does not match authenticated user"
        )

    return user_id


# Annotated type for dependency injection
UserIdDependency = Annotated[str, Depends(validate_user_id)]


# Define the router for authentication endpoints
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Request models
class UserCreateRequest(BaseModel):
    email: str
    password: str
    username: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


@router.post("/sign-up/email", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(
    user_data: UserCreateRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user with email and password.

    Creates a new user account and returns a JWT token upon successful registration.
    """
    # Check if user already exists
    existing_user = session.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Generate a unique user ID
    user_id = str(uuid.uuid4())

    # Create new user (password hashing should be implemented in production)
    # For now, storing plain password for demonstration - in production use pwd_context.hash()
    new_user = User(
        id=user_id,
        email=user_data.email,
        username=user_data.username or user_data.email.split('@')[0],
        hashed_password=user_data.password,  # This should be properly hashed in production
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create access token
    access_token_expires = timedelta(minutes=30)  # Token expires in 30 minutes
    access_token = create_access_token(
        data={"user_id": new_user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Response model for user profile
class UserProfileResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: datetime


@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    current_user_id: str = Depends(get_current_user),
    db_session: Session = Depends(get_session)
):
    """
    Get authenticated user's profile information.

    Args:
        current_user_id: User ID from the authenticated token
        db_session: Database session

    Returns:
        User profile information
    """
    user = db_session.get(User, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "created_at": user.created_at
    }


@router.post("/login", response_model=Token)
def login_user(
    user_data: UserLoginRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user with email and password.

    Returns a JWT token upon successful authentication.
    """
    # Find user by email
    user = session.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password (simplified - in production use pwd_context.verify())
    # For demo purposes, comparing plain text - this should be properly hashed in production
    if user.hashed_password != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)  # Token expires in 30 minutes
    access_token = create_access_token(
        data={"user_id": user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/sign-in/email", response_model=Token)
def sign_in_user(
    user_data: UserLoginRequest,
    session: Session = Depends(get_session)
):
    """
    Sign in user with email and password (Better Auth compatible endpoint).

    Returns a JWT token upon successful authentication.
    """
    # Find user by email
    user = session.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password (simplified - in production use pwd_context.verify())
    # For demo purposes, comparing plain text - this should be properly hashed in production
    if user.hashed_password != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)  # Token expires in 30 minutes
    access_token = create_access_token(
        data={"user_id": user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }