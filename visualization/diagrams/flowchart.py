"""
flowchart.py

Generates Mermaid Flowcharts.
"""

from .mermaid import Mermaid


class FlowchartGenerator(Mermaid):
    """
    Generates Mermaid Flowcharts.
    """

    def generate(self, workflow: dict) -> str:

        self.clear()

        direction = workflow.get("direction", "TD")

        self.add(f"flowchart {direction}")
        self.add("")

        # Generate Nodes
        for step in workflow.get("steps", []):

            node_id = step["id"]
            label = step["label"]

            self.add(f'{node_id}["{label}"]')

        self.add("")

        # Generate Connections
        for edge in workflow.get("connections", []):

            source = edge["from"]
            target = edge["to"]

            arrow = edge.get("arrow", "-->")

            self.add(f"{source} {arrow} {target}")

        return self.build()