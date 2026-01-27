from sqlmodel import SQLModel
from typing import Any


class Base(SQLModel):
    """
    Base class for all SQLModel models.

    This class provides common functionality for all models in the application.
    """
    pass  # Currently just extends SQLModel for future extensibility


def create_db_and_tables(engine):
    """
    Creates all database tables based on the SQLModel models.

    Args:
        engine: The SQLModel engine instance
    """
    SQLModel.metadata.create_all(bind=engine)