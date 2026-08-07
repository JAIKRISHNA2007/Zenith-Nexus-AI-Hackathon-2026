from fastapi import APIRouter

from backend.app.schemas.visualization import (
    VisualizationRequest,
    VisualizationResponse,
)
from backend.app.services.visualization_service import prepare_visualization

router = APIRouter(
    prefix="/api/v1/visualization",
    tags=["Visualization"],
)


@router.post(
    "",
    response_model=VisualizationResponse,
)
def visualize(request: VisualizationRequest):
    return prepare_visualization(
        request.chart_type,
        request.rows,
        request.config.model_dump(),
    )