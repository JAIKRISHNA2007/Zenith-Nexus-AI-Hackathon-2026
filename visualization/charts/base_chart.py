"""
base_chart.py

Base class for all chart generators.
"""

from abc import ABC, abstractmethod


class BaseChart(ABC):
    """
    Abstract base class for every chart.

    Every chart must:
    1. Validate input data.
    2. Generate a standard chart specification.
    """

    def validate(self, data: list):
        """
        Common validation shared by all charts.
        """

        if not isinstance(data, list):
            raise TypeError("Chart data must be a list.")

        if len(data) == 0:
            raise ValueError("Chart data cannot be empty.")

    @property
    @abstractmethod
    def chart_type(self) -> str:
        """
        Returns chart type.
        """
        pass

    def generate(self, data: list, config: dict) -> dict:
        """
        Generates a standardized chart configuration.
        """

        self.validate(data)

        return {
            "chartType": self.chart_type,
            "title": config.get("title", ""),
            "xAxis": config.get("xAxis"),
            "yAxis": config.get("yAxis"),
            "category": config.get("category"),
            "value": config.get("value"),
            "data": data
        }