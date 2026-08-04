from .bar_chart import BarChart
from .line_chart import LineChart
from .pie_chart import PieChart
from .scatter_chart import ScatterChart


class ChartFactory:

    _chart_registry = {
        "bar": BarChart,
        "line": LineChart,
        "pie": PieChart,
        "scatter": ScatterChart,
    }

    @classmethod
    def create_chart(cls, chart_type: str):

        if not isinstance(chart_type, str):
            raise TypeError("Chart type must be a string.")

        chart_type = chart_type.lower().strip()

        chart_class = cls._chart_registry.get(chart_type)

        if chart_class is None:
            raise ValueError(f"Unsupported chart type: {chart_type}")

        return chart_class()

    @classmethod
    def supported_charts(cls):
        return list(cls._chart_registry.keys())