from .base_chart import BaseChart


class PieChart(BaseChart):

    def validate(self, data):
        if not data:
            raise ValueError("Pie chart requires non-empty data.")

    def generate(self, data, config):

        self.validate(data)

        return {
            "chartType": "pie",
            "title": config.get("title", "Pie Chart"),
            "category": config.get("category"),
            "value": config.get("value"),
            "data": data
        }