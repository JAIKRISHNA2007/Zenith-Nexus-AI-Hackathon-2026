from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.services.message_service import (
    create_new_message,
    get_conversation_messages,
)


class MessageRequest(BaseModel):
    role: str
    content: str


router = APIRouter(
    prefix="/api/v1/messages",
    tags=["Messages"],
)


@router.post("/{conversation_id}")
def create_message_api(
    conversation_id: int,
    request: MessageRequest,
    db: Session = Depends(get_db),
):
    return create_new_message(
        db,
        conversation_id,
        request.role,
        request.content,
    )


@router.get("/{conversation_id}")
def read_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    return get_conversation_messages(
        db,
        conversation_id,
    )