from typing import Any

from backend.app.schemas.visualization import VisualizationResponse
from visualization.services.visualization_service import (
    VisualizationService as VisualizationModuleService,
)


def prepare_visualization(
    chart_type: str,
    rows: list[dict[str, Any]],
    config: dict[str, Any] | None = None,
) -> VisualizationResponse:
    """
    Bridge the backend API to the visualization module's public service.
    """

    chart_spec = VisualizationModuleService().generate_chart(
        chart_type=chart_type,
        data=rows or [],
        config=config or {},
    )

    return VisualizationResponse(**chart_spec)