"""
bar_chart.py

Bar Chart implementation.
"""

from .base_chart import BaseChart


class BarChart(BaseChart):

    @property
    def chart_type(self):
        return "bar"