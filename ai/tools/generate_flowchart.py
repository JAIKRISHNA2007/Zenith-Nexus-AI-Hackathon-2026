from langchain_core.tools import tool

from ai.schemas import FlowchartSchema
from ai.utils.error_handler import tool_error_handler


@tool
@tool_error_handler
def generate_flowchart(
    diagram_type: str,
    content: str,
) -> dict:
    """
    Generate a Mermaid diagram.

    Rules:
    - Database relationships -> ER Diagram
    - Business process -> Flowchart
    - Decision making -> Decision Tree

    If the user explicitly requests a diagram type,
    always use that type.
    """

    diagram_type = diagram_type.lower()

    valid = {
        "flowchart",
        "er",
        "decision-tree",
    }

    if diagram_type not in valid:
        diagram_type = "flowchart"

    diagram = FlowchartSchema(
        diagram_type=diagram_type,
        content=content,
    )

    return diagram.model_dump()