"""
Database package initialization.

This module provides database initialization functionality for the application.
"""

from .engine import engine
from .session import get_session
from ..models.base import create_db_and_tables


def init_database():
    """
    Initializes the database by creating all required tables.

    This function should be called during application startup to ensure
    all database tables are created if they don't exist.
    """
    create_db_and_tables(engine)


__all__ = ["engine", "get_session", "init_database"]