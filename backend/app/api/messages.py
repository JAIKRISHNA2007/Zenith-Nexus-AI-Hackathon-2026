from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.services.message_service import (
    create_new_message,
    get_conversation_messages,
)


from backend.app.schemas.message import (
    MessageCreate,
    MessageResponse,
)


router = APIRouter(
    prefix="/api/v1/messages",
    tags=["Messages"],
)


@router.post(
    "/{conversation_id}",
    response_model=MessageResponse
)
def create_message_api(
    conversation_id: int,
    request: MessageCreate,
    db: Session = Depends(get_db),
):
    return create_new_message(
        db,
        conversation_id,
        request.role,
        request.content,
    )


@router.get(
    "/{conversation_id}",
    response_model=list[MessageResponse]
)
def read_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    return get_conversation_messages(
        db,
        conversation_id,
    )