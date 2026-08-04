"""
chart_selector.py

Public interface for chart generation.
"""

from .chart_factory import ChartFactory


class ChartSelector:

    @staticmethod
    def generate_chart(
        chart_type: str,
        data: list,
        config: dict
    ):
        """
        Generates a standardized chart specification.
        """

        chart = ChartFactory.create_chart(chart_type)

        return chart.generate(data, config)

    @staticmethod
    def available_charts():
        """
        Returns all supported chart types.
        """

        return ChartFactory.supported_charts()