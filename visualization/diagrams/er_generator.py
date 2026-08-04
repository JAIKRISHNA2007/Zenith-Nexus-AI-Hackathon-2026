"""
er_generator.py

Generates Mermaid ER diagrams from database schema.
"""

from .mermaid import Mermaid


class ERGenerator(Mermaid):
    """
    Generates Mermaid ER Diagram.
    """

    def generate(self, schema: dict) -> str:

        self.clear()

        self.add("erDiagram")
        self.add("")

        # Generate Tables
        for table in schema.get("tables", []):

            self.add(f"{table['name'].upper()} {{")

            for column in table.get("columns", []):

                column_type = column.get("type", "string")
                column_name = column.get("name", "")

                self.add(f"    {column_type} {column_name}")

            self.add("}")
            self.add("")

        # Generate Relationships
        for relation in schema.get("relationships", []):

            source = relation["from"].upper()
            target = relation["to"].upper()
            label = relation.get("label", "")

            relation_type = relation.get("type", "one-to-many")

            if relation_type == "one-to-many":
                connector = "||--o{"

            elif relation_type == "one-to-one":
                connector = "||--||"

            elif relation_type == "many-to-many":
                connector = "}o--o{"

            else:
                connector = "||--o{"

            self.add(
                f"{source} {connector} {target} : {label}"
            )

        return self.build()