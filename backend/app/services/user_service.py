from sqlalchemy.orm import Session

from backend.app.repositories.user_repository import (
    create_user,
    get_users,
)
from backend.app.schemas.user import UserCreate


def create_new_user(db: Session, user: UserCreate):
    return create_user(db, user)


def get_all_users(db: Session):
    return get_users(db)