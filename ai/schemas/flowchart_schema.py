from pydantic import BaseModel


class FlowchartSchema(BaseModel):
    diagram_type: str
    content: str