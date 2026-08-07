from sqlalchemy.orm import Session

from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from backend.app.repositories.auth_repository import (
    get_user_by_email,
    create_user,
)


def register_user(db: Session, name: str, email: str, password: str):
    existing = get_user_by_email(db, email)

    if existing:
        raise ValueError("Email already registered")

    hashed_password = hash_password(password)

    return create_user(
        db,
        name,
        email,
        hashed_password,
    )


def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password):
        raise ValueError("Invalid credentials")

    token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }