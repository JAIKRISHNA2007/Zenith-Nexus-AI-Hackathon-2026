from sqlalchemy.orm import Session

from backend.app.models.user import User
from backend.app.schemas.user import UserCreate


def create_user(db: Session, user: UserCreate, hashed_pwd: str | None = None) -> User:
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pwd if hashed_pwd else user.password,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_users(db: Session):
    return db.query(User).all()