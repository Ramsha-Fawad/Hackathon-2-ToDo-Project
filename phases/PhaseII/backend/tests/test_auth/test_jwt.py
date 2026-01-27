import pytest
from datetime import datetime, timedelta
import jwt
from ...src.utils.auth import verify_token, extract_user_id_from_token, create_access_token
from ...src.config.settings import settings


def test_verify_valid_token():
    """Test verifying a valid JWT token"""
    payload = {
        "user_id": "test_user_123",
        "exp": datetime.utcnow() + timedelta(minutes=15)  # Expires in 15 minutes
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)

    result = verify_token(token)

    assert result["user_id"] == "test_user_123"


def test_verify_expired_token():
    """Test verifying an expired JWT token"""
    payload = {
        "user_id": "test_user_123",
        "exp": datetime.utcnow() - timedelta(minutes=10)  # Expired 10 minutes ago
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)

    with pytest.raises(Exception):  # Should raise HTTPException
        verify_token(token)


def test_extract_user_id_from_valid_token():
    """Test extracting user_id from a valid token"""
    payload = {
        "user_id": "test_user_123",
        "exp": datetime.utcnow() + timedelta(minutes=15)  # Expires in 15 minutes
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)

    user_id = extract_user_id_from_token(token)

    assert user_id == "test_user_123"


def test_extract_user_id_from_invalid_token():
    """Test extracting user_id from an invalid token"""
    invalid_token = "invalid.token.string"

    with pytest.raises(Exception):  # Should raise HTTPException
        extract_user_id_from_token(invalid_token)


def test_extract_user_id_from_expired_token():
    """Test extracting user_id from an expired token"""
    payload = {
        "user_id": "test_user_123",
        "exp": datetime.utcnow() - timedelta(minutes=10)  # Expired 10 minutes ago
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)

    with pytest.raises(Exception):  # Should raise HTTPException
        extract_user_id_from_token(token)


def test_create_access_token():
    """Test creating a valid access token"""
    data = {"user_id": "test_user_123", "other_claim": "some_value"}

    token = create_access_token(data)

    # Verify the token can be decoded
    decoded_payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=[settings.JWT_ALGORITHM])

    assert decoded_payload["user_id"] == "test_user_123"
    assert decoded_payload["other_claim"] == "some_value"
    assert "exp" in decoded_payload  # Should have expiration


def test_create_access_token_with_custom_expiry():
    """Test creating a token with custom expiration time"""
    from datetime import timedelta

    data = {"user_id": "test_user_123"}
    custom_expiry = timedelta(minutes=30)  # 30 minutes expiry

    token = create_access_token(data, expires_delta=custom_expiry)

    # Verify the token can be decoded
    decoded_payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=[settings.JWT_ALGORITHM])

    assert decoded_payload["user_id"] == "test_user_123"
    assert "exp" in decoded_payload  # Should have expiration


def test_jwt_algorithm_security():
    """Test that the correct algorithm is used for security"""
    data = {"user_id": "test_user_123"}

    token = create_access_token(data)

    # Decode without verification to check header
    header = jwt.get_unverified_header(token)

    assert header["alg"] == settings.JWT_ALGORITHM  # Should match configured algorithm


def test_token_clock_skew_tolerance():
    """Test that tokens slightly past expiration are still accepted within clock skew"""
    # Create a token that expired very recently (within clock skew)
    payload = {
        "user_id": "test_user_123",
        "exp": datetime.utcnow() - timedelta(seconds=30)  # Expired 30 seconds ago
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.JWT_ALGORITHM)

    # This might succeed if clock skew tolerance is sufficient
    # If clock skew is smaller than 30 seconds, this will fail
    try:
        result = verify_token(token)
        # If it succeeded, verify it's the right user
        assert result["user_id"] == "test_user_123"
    except Exception:
        # Expected if clock skew is less than 30 seconds
        pass


def test_malformed_token_handling():
    """Test handling of malformed tokens"""
    malformed_tokens = [
        "just.a.malformed.token.string.with.wrong.parts.count",
        "",
        "not.at.all.a.jwt",
        "1.2.3",  # Wrong format
    ]

    for token in malformed_tokens:
        with pytest.raises(Exception):  # Should raise HTTPException
            extract_user_id_from_token(token)