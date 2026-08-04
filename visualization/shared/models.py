from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Axis(BaseModel):
    """
    Represents an axis in a chart.
    """

    field: str = Field(..., description="Field name from dataset")
    label: str = Field(..., description="Display label")


class ChartConfig(BaseModel):
    """
    Configuration used for rendering a chart.
    """

    title: str

    xAxis: Optional[Axis] = None

    yAxis: Optional[Axis] = None

    category: Optional[str] = None

    value: Optional[str] = None

    color: Optional[str] = "#2563eb"

    showLegend: bool = True

    showGrid: bool = True


class ChartRequest(BaseModel):
    """
    Input received by visualization module.
    """

    chartType: str

    data: List[Dict[str, Any]]

    config: ChartConfig


class ChartResponse(BaseModel):
    """
    Output returned to frontend.
    """

    success: bool

    chartType: str

    config: ChartConfig

    data: List[Dict[str, Any]]

    message: Optional[str] = None