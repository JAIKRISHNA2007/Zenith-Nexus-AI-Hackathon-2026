from langchain_core.tools import tool

from ai.schemas import ChartSchema
from ai.utils.error_handler import tool_error_handler


@tool
@tool_error_handler
def generate_chart(
    chart_type: str,
    title: str,
    x_axis: str,
    y_axis: str,
    data: list,
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

    chart_type = chart_type.lower()

    valid = {
        "bar",
        "line",
        "pie",
        "scatter",
    }

    if chart_type not in valid:
        chart_type = "bar"

    chart = ChartSchema(
        chart_type=chart_type.title(),
        title=title,
        x_axis=x_axis,
        y_axis=y_axis,
        data=data,
    )

    return chart.model_dump()