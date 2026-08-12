import json
from langchain_core.tools import tool

from ai.schemas import ChartSchema


@tool
def generate_chart(
    chart_type: str,
    title: str,
    x_axis: str,
    y_axis: str,
    data: list | str,
) -> dict:
    """
    Generate a chart for query results.

    Rules:
    - Revenue comparisons -> Bar Chart
    - Time series / trends -> Line Chart
    - Percentage / distribution -> Pie Chart
    - Correlation -> Scatter Plot

    If the user explicitly requests a chart type,
    always use that chart.
    """
    try:
        chart_type_clean = str(chart_type).lower().strip()

        valid = {"bar", "line", "pie", "scatter"}
        if chart_type_clean not in valid:
            chart_type_clean = "bar"

        # Normalise `data`: LLMs sometimes pass a JSON string instead of a list
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (json.JSONDecodeError, ValueError):
                import ast
                try:
                    data = ast.literal_eval(data)
                except (ValueError, SyntaxError):
                    data = []
        
        # If it's a dict with a 'rows' or 'data' key, unwrap it
        if isinstance(data, dict):
            data = data.get("rows", data.get("data", []))

        # Ensure it's a list of dicts
        if not isinstance(data, list):
            data = []

        # Ensure each row is a dict (not a string)
        normalised_rows = []
        for item in data:
            if isinstance(item, dict):
                normalised_rows.append(item)
            elif isinstance(item, str):
                try:
                    parsed = json.loads(item)
                    if isinstance(parsed, dict):
                        normalised_rows.append(parsed)
                except (json.JSONDecodeError, ValueError):
                    pass

        capped_data = normalised_rows[:20]

        chart = ChartSchema(
            chart_type=chart_type_clean.title(),
            title=str(title),
            x_axis=str(x_axis),
            y_axis=str(y_axis),
            data=capped_data,
        )

        return chart.model_dump()
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
        }