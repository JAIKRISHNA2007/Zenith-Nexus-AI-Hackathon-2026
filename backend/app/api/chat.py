from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)
from backend.app.services.chat_service import process_chat

router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    return process_chat(
        db,
        request.conversation_id,
        request.prompt,
    )