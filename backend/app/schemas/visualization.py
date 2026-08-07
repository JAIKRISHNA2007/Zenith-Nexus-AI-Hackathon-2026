from typing import Any

from pydantic import BaseModel, Field


class ChartConfig(BaseModel):
    """
    Configuration required to render a chart.
    """

    title: str = ""

    xAxis: str | None = None

    yAxis: str | None = None

    category: str | None = None

    value: str | None = None


class VisualizationRequest(BaseModel):
    """
    Request received from AI/Backend.
    """

    chart_type: str = Field(
        ...,
        description="Chart type such as bar, line, pie or scatter."
    )

    rows: list[dict[str, Any]]

    config: ChartConfig


class VisualizationResponse(BaseModel):
    """
    Standard response returned to frontend.
    """

    chartType: str

    title: str

    xAxis: str | None = None

    yAxis: str | None = None

    category: str | None = None

    value: str | None = None

    data: list[dict[str, Any]]
