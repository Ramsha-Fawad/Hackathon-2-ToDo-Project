from typing import Generator
from sqlmodel import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..database.session import get_session
from ..utils.auth import extract_user_id_from_token


security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    FastAPI dependency to get the current authenticated user from JWT token.

    Extracts the user_id from the JWT token in the Authorization header.

    Returns:
        The user_id extracted from the token

    Raises:
        HTTPException: If token is invalid, expired, or user_id is missing
    """
    token = credentials.credentials
    try:
        user_id = extract_user_id_from_token(token)
        return user_id
    except HTTPException:
        raise


def get_db_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    This dependency creates a database session for each request and ensures
    it's properly closed after the request is completed.
    """
    session_generator = get_session()
    session = next(session_generator)
    try:
        yield session
    finally:
        # Note: In the generator, the 'with' statement in get_session
        # will automatically close the session
        pass