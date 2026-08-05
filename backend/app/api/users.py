from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.services.user_service import (
    create_new_user as create_user_service,
    get_all_users,
)
from backend.app.schemas.user import UserCreate, UserResponse

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.post("", response_model=UserResponse)
def create_new_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user_service(db, user)


@router.get("", response_model=list[UserResponse])
def read_users(
    db: Session = Depends(get_db)
):
    return get_all_users(db)