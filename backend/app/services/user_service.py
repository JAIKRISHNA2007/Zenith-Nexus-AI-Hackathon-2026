from sqlalchemy.orm import Session

from backend.app.core.security import hash_password
from backend.app.repositories.user_repository import (
    create_user,
    get_users,
)
from backend.app.schemas.user import UserCreate


def create_new_user(db: Session, user: UserCreate):
    hashed_pwd = hash_password(user.password)
    return create_user(db, user, hashed_pwd=hashed_pwd)


def get_all_users(db: Session):
    return get_users(db)