from sqlalchemy.orm import Session
from ai.integration.backend_agent import process_prompt
from backend.app.services.message_service import create_new_message
from ai.schemas.agent_response import AgentResponse


def process_chat(db: Session, conversation_id: int, prompt: str):
    """
    Process chat request by delegating to the LangGraph ReAct agent
    and persisting user prompt and AI response to the message history.
    Handles API errors (such as 429 Rate Limits) gracefully.
    """
    # 1. Save user prompt to messages table
    create_new_message(db, conversation_id, "user", prompt)

    try:
        # 2. Invoke AI agent
        ai_response = process_prompt(prompt, conversation_id=conversation_id)

        # 3. Determine AI message text content
        reply_content = (
            ai_response.response
            or ai_response.explanation
            or (f"SQL Generated: {ai_response.query.sql}" if ai_response.query and ai_response.query.sql else None)
            or "I have processed your request."
        )

        # 4. Save AI response to messages table
        create_new_message(db, conversation_id, "assistant", reply_content)

        return ai_response
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "Quota exceeded" in error_msg:
            fallback_text = "Gemini API rate limit reached (429 Resource Exhausted). Free Tier quota exceeded; please retry in a few seconds."
        else:
            fallback_text = f"Error generating response: {error_msg}"

        create_new_message(db, conversation_id, "assistant", fallback_text)
        return AgentResponse(response=fallback_text)