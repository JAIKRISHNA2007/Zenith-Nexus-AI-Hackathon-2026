from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversation_id: int
    prompt: str


class ChatResponse(BaseModel):
    response: str