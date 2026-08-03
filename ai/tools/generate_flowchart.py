from typing import Dict
from langchain_core.tools import tool


@tool
def generate_flowchart(description: str) -> Dict:
    """
    Generates a Mermaid flowchart.
    Later this will call the visualization module.
    """

    mermaid = f"""
flowchart TD
    A[Start]
    B[{description}]
    C[End]

    A --> B
    B --> C
"""

    return {
        "status": "success",
        "diagram": mermaid
    }