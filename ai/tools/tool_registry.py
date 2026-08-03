from ai.tools.get_schema import get_schema
from ai.tools.execute_query import execute_query
from ai.tools.generate_chart import generate_chart
from ai.tools.generate_flowchart import generate_flowchart
from ai.tools.explain_data import explain_data


TOOLS = {
    "get_schema": get_schema,
    "execute_query": execute_query,
    "generate_chart": generate_chart,
    "generate_flowchart": generate_flowchart,
    "explain_data": explain_data,
}