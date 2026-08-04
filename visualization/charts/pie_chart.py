"""
pie_chart.py

Pie Chart implementation.
"""

from .base_chart import BaseChart


class PieChart(BaseChart):

    @property
    def chart_type(self):
        return "pie"