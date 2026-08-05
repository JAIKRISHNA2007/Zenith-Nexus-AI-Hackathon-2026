from backend.app.schemas.visualization import (
    VisualizationResponse,
)


def prepare_visualization(rows: list[dict]):
    """
    Placeholder service.

    The visualization team can later replace
    this logic with chart recommendations.
    """

    return VisualizationResponse(
        chart_type="table",
        data=rows,
    )