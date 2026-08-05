from backend.app.schemas.chat import ChatResponse


def process_chat(conversation_id: int, prompt: str):
    """
    Temporary placeholder.
    The AI team will later replace this with
    Gemini/OpenAI integration.
    """

    return ChatResponse(
        response=f"AI placeholder response for: {prompt}"
    )