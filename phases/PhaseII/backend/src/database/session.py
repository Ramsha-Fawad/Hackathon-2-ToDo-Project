from sqlmodel import Session, create_engine
from contextlib import contextmanager
from typing import Generator
from ..config.settings import settings

# Import the engine from engine.py to reuse the same instance
from .engine import engine


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency to provide database sessions.

    Yields a Session object that is automatically closed after the request.
    """
    with Session(engine) as session:
        yield session


@contextmanager
def get_session_context():
    """
    Context manager for database sessions outside of FastAPI dependency injection.
    """
    with Session(engine) as session:
        yield session