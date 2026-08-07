from backend.app.schemas.visualization import (
    VisualizationRequest,
    VisualizationResponse,
)


def prepare_visualization(request: VisualizationRequest):
    """
    Build a visualization response from the request payload.

    The service keeps the contract stable for the frontend while
    allowing the AI layer to decide the chart metadata.
    """

    return VisualizationResponse(
        chartType=request.chart_type,
        title=request.config.title or "Visualization",
        xAxis=request.config.xAxis,
        yAxis=request.config.yAxis,
        category=request.config.category,
        value=request.config.value,
        data=request.rows,
    )