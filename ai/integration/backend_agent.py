from typing import Optional, Union
from ai.agents.react_agent import agent
from ai.response.formatter import format_response
from ai.schemas.agent_response import AgentResponse


def process_prompt(
    prompt: str,
    conversation_id: Optional[Union[int, str]] = "default_thread",
) -> AgentResponse:
    """
    Integration function that processes a user prompt using the LangGraph ReAct agent.

    Hides internal LangGraph execution details from the caller and returns
    a formatted AgentResponse.
    """
    thread_id = str(conversation_id) if conversation_id is not None else "default_thread"

    response = agent.invoke(
        {
            "messages": [
                ("user", prompt)
            ]
        },
        config={
            "configurable": {
                "thread_id": thread_id
            }
        }
    )

    return format_response(response.get("messages", []))
