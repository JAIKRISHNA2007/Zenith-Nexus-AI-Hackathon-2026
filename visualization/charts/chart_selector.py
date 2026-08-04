from .chart_factory import ChartFactory


class ChartSelector:
    """
    Entry point for generating charts.
    """

    @staticmethod
    def generate_chart(chart_type: str, data: list, config: dict):

        if not data:
            raise ValueError("Chart data cannot be empty.")

        if not isinstance(config, dict):
            raise TypeError("Config must be a dictionary.")

        chart = ChartFactory.create_chart(chart_type)

        return chart.generate(data, config)