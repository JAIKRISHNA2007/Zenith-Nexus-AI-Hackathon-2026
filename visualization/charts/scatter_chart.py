from .base_chart import BaseChart


class ScatterChart(BaseChart):

    def validate(self, data):
        if not data:
            raise ValueError("Scatter chart requires non-empty data.")

    def generate(self, data, config):

        self.validate(data)

        return {
            "chartType": "scatter",
            "title": config.get("title", "Scatter Chart"),
            "xAxis": config.get("xAxis"),
            "yAxis": config.get("yAxis"),
            "data": data
        }