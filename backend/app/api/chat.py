from fastapi import APIRouter

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
def chat(request: ChatRequest):
    return process_chat(
        request.conversation_id,
        request.prompt,
    )