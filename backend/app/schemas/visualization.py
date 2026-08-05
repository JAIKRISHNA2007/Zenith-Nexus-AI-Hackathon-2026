from pydantic import BaseModel


class VisualizationRequest(BaseModel):
    rows: list[dict]


class VisualizationResponse(BaseModel):
    chart_type: str
    data: list[dict]