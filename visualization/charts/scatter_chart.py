"""
scatter_chart.py

Scatter Chart implementation.
"""

from .base_chart import BaseChart


class ScatterChart(BaseChart):

    @property
    def chart_type(self):
        return "scatter"