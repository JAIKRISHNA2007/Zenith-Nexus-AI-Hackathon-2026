"""
visualization_service.py

Public API for the visualization module.

The AI and backend should only communicate with this service.
"""

from visualization.charts.chart_selector import ChartSelector
from visualization.diagrams.er_generator import ERGenerator
from visualization.diagrams.flowchart import FlowchartGenerator
from visualization.diagrams.decision_tree import DecisionTreeGenerator


class VisualizationService:
    """
    Public service for charts and diagrams.
    """

    def generate_chart(
        self,
        chart_type: str,
        data: list,
        config: dict,
    ) -> dict:

        return ChartSelector.generate_chart(
            chart_type,
            data,
            config,
        )

    def generate_er(
        self,
        schema: dict,
    ) -> str:

        return ERGenerator().generate(schema)

    def generate_flowchart(
        self,
        workflow: dict,
    ) -> str:

        return FlowchartGenerator().generate(workflow)

    def generate_decision_tree(
        self,
        tree: dict,
    ) -> str:

        return DecisionTreeGenerator().generate(tree)