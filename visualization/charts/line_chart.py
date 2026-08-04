"""
line_chart.py

Line Chart implementation.
"""

from .base_chart import BaseChart


class LineChart(BaseChart):

    @property
    def chart_type(self):
        return "line"