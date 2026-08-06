from ai.integration.backend_agent import process_prompt


def process_chat(conversation_id: int, prompt: str):
    """
    Process chat request by delegating to the LangGraph ReAct agent
    via the AI integration layer.
    """
    return process_prompt(prompt, conversation_id=conversation_id)