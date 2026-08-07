from pydantic import BaseModel
from typing import Any


class ChartSchema(BaseModel):
    chart_type: str
    title: str
    x_axis: str
    y_axis: str
    data: Any