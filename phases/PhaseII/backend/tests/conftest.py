import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, Session
from sqlmodel.pool import StaticPool
from datetime import datetime, timedelta
import jwt
from unittest.mock import patch

from ..src.main import app
from ..src.database.engine import engine
from ..src.models.task import Task
from ..src.config.settings import settings


@pytest.fixture(name="engine")
def engine_fixture():
    # Create an in-memory SQLite database for testing
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest.fixture(name="db_session")
def db_session_fixture(engine):
    # Create tables and yield a session
    from ..src.models.base import create_db_and_tables
    create_db_and_tables(engine)

    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture():
    # Create a test client
    with TestClient(app) as client:
        yield client


@pytest.fixture(name="valid_user_id")
def valid_user_id_fixture():
    return "user_123_test"


@pytest.fixture(name="expired_token")
def expired_token_fixture(valid_user_id):
    # Create an expired JWT token
    payload = {
        "user_id": valid_user_id,
        "exp": datetime.utcnow() - timedelta(minutes=10)  # Expired 10 minutes ago
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


@pytest.fixture(name="valid_token")
def valid_token_fixture(valid_user_id):
    # Create a valid JWT token
    payload = {
        "user_id": valid_user_id,
        "exp": datetime.utcnow() + timedelta(minutes=15)  # Expires in 15 minutes
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


@pytest.fixture(name="different_user_token")
def different_user_token_fixture():
    # Create a JWT token for a different user
    payload = {
        "user_id": "different_user_456",
        "exp": datetime.utcnow() + timedelta(minutes=15)  # Expires in 15 minutes
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token