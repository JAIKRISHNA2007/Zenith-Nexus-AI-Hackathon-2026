from typing import Dict, Any
from langchain_core.tools import tool


@tool
def generate_chart(data: Dict[str, Any], chart_type: str = "bar") -> Dict[str, Any]:
    """
    Generates chart information from query results.
    Later this will call the visualization module.
    """

    return {
        "status": "success",
        "chart_type": chart_type,
        "data": data,
        "message": f"{chart_type.capitalize()} chart generated successfully."
    }