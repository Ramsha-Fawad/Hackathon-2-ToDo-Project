from typing import Optional
from fastapi import HTTPException, status


def validate_title_length(title: Optional[str]) -> str:
    """
    Validate that the title is between 1 and 100 characters.

    Args:
        title: The title to validate

    Returns:
        The validated title

    Raises:
        HTTPException: If title is invalid
    """
    if title is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title is required"
        )

    if len(title) < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title must be at least 1 character long"
        )

    if len(title) > 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title must be no more than 100 characters long"
        )

    return title


def validate_description_length(description: Optional[str]) -> Optional[str]:
    """
    Validate that the description is between 0 and 1000 characters.

    Args:
        description: The description to validate

    Returns:
        The validated description

    Raises:
        HTTPException: If description is invalid
    """
    if description is None:
        return None

    if len(description) > 1000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Description must be no more than 1000 characters long"
        )

    return description


def validate_non_empty_title(title: Optional[str]) -> str:
    """
    Validate that the title is not empty.

    Args:
        title: The title to validate

    Returns:
        The validated title

    Raises:
        HTTPException: If title is empty
    """
    if title is None or title.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title cannot be empty"
        )

    return title.strip()