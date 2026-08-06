from typing import Optional, Any
from pydantic import BaseModel

from ai.schemas.chart_schema import ChartSchema
from ai.schemas.flowchart_schema import FlowchartSchema
from ai.schemas.query_schema import QuerySchema


class ChatRequest(BaseModel):
    conversation_id: int
    prompt: str


class ChatResponse(BaseModel):
    query: Optional[QuerySchema] = None
    chart: Optional[ChartSchema] = None
    flowchart: Optional[FlowchartSchema] = None
    explanation: Optional[str] = None
    metadata: Optional[Any] = None
    response: Optional[str] = None