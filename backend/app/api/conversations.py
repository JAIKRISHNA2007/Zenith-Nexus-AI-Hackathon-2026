from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.services.conversation_service import (
    create_new_conversation,
    get_all_conversations,
    get_conversation,
)

router = APIRouter(
    prefix="/api/v1/conversations",
    tags=["Conversations"]
)


@router.post("/{user_id}")
def create_conversation_api(
    user_id: int,
    db: Session = Depends(get_db)
):
    return create_new_conversation(db, user_id)


@router.get("")
def read_conversations(
    db: Session = Depends(get_db)
):
    return get_all_conversations(db)


@router.get("/{conversation_id}")
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    return get_conversation(db, conversation_id)