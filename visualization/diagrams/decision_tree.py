"""
decision_tree.py

Generates Mermaid Decision Trees.
"""

from .mermaid import Mermaid


class DecisionTreeGenerator(Mermaid):
    """
    Generates Mermaid Decision Trees.
    """

    def generate(self, tree: dict) -> str:

        self.clear()

        self.add("flowchart TD")
        self.add("")

        root = tree.get("root")

        # Create Nodes
        for node in tree.get("nodes", []):

            node_id = node["id"]
            label = node["label"]

            if node_id == root:
                self.add(f'{node_id}{{"{label}"}}')
            else:
                self.add(f'{node_id}["{label}"]')

        self.add("")

        # Create Connections
        for edge in tree.get("edges", []):

            source = edge["from"]
            target = edge["to"]
            label = edge.get("label")

            if label:
                self.add(f"{source} -->|{label}| {target}")
            else:
                self.add(f"{source} --> {target}")

        return self.build()