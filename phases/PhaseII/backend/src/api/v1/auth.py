from fastapi import Depends, HTTPException, status
from typing import Annotated
from ..deps import get_current_user


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