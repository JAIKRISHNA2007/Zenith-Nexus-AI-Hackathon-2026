from ai.memory.memory import memory
from langgraph.prebuilt import create_react_agent
from ai.tools.generate_sql import generate_sql
from ai.prompts.system_prompt import SYSTEM_PROMPT


from ai.tools.get_schema import get_schema
from ai.tools.execute_query import execute_query
from ai.tools.generate_chart import generate_chart
from ai.tools.generate_flowchart import generate_flowchart
from ai.tools.explain_data import explain_data




from ai.providers import get_provider

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

agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=SYSTEM_PROMPT,
    checkpointer=memory,
)