"""
export_csv.py

Exports chart/query data to CSV.
"""

import csv
from pathlib import Path


class CSVExporter:
    """
    Exports JSON data into CSV format.
    """

    def export(self, data: list[dict], output_file: str):

        if not data:
            raise ValueError("No data available for CSV export.")

        output_path = Path(output_file)

        with open(output_path, "w", newline="", encoding="utf-8") as csv_file:

            writer = csv.DictWriter(
                csv_file,
                fieldnames=data[0].keys()
            )

            writer.writeheader()

            writer.writerows(data)

        return str(output_path)