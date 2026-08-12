from langchain_core.messages import SystemMessage, ToolMessage
from ai.memory.memory import memory
from langgraph.prebuilt import create_react_agent
from ai.tools.generate_sql import generate_sql
from ai.prompts.system_prompt import SYSTEM_PROMPT

from ai.providers.factory import get_provider
from ai.tools.get_schema import get_schema
from ai.tools.execute_query import execute_query
from ai.tools.generate_chart import generate_chart
from ai.tools.generate_flowchart import generate_flowchart
from ai.tools.explain_data import explain_data


provider = get_provider()

llm = provider.get_llm()

tools = [
    get_schema,
    generate_sql,
    execute_query,
    generate_chart,
    generate_flowchart,
    explain_data,
]


def prompt_modifier(state: dict) -> list:
    """
    State modifier function for LLM context optimization:
    1. Ensures SYSTEM_PROMPT is prepended.
    2. Limits conversation history window to last 8 messages for multi-turn context.
    3. Truncates overly large ToolMessage strings in context history.
    """
    messages = state.get("messages", [])
    filtered = [m for m in messages if not isinstance(m, SystemMessage)]
    recent = filtered[-8:] if len(filtered) > 8 else filtered

    cleaned = []
    for msg in recent:
        if isinstance(msg, ToolMessage):
            content_str = str(msg.content)
            if len(content_str) > 3000:
                content_str = content_str[:3000] + "... [tool output truncated for context optimization]"
            cleaned.append(
                ToolMessage(
                    content=content_str,
                    tool_call_id=getattr(msg, "tool_call_id", ""),
                    name=getattr(msg, "name", None),
                )
            )
        else:
            cleaned.append(msg)

    return [SystemMessage(content=SYSTEM_PROMPT)] + cleaned


agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=prompt_modifier,
    checkpointer=memory,
)