from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from backend.app.services.auth_service import (
    register_user,
    login_user,
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        return register_user(
            db,
            request.name,
            request.email,
            request.password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        return login_user(
            db,
            request.email,
            request.password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )