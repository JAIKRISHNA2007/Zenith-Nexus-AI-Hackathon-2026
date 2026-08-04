"""
mermaid.py

Base Mermaid builder used by all diagram generators.
"""


class Mermaid:
    """
    Base class for building Mermaid diagrams.
    """

    def __init__(self):

        self.lines = []

    def add(self, text: str):
        """
        Adds one Mermaid line.

        Example:
            flowchart TD
            A --> B
        """

        self.lines.append(text)

    def add_many(self, lines: list[str]):
        """
        Adds multiple Mermaid lines.
        """

        self.lines.extend(lines)

    def clear(self):
        """
        Clears the current diagram.
        """

        self.lines.clear()

    def build(self) -> str:
        """
        Returns the final Mermaid diagram.
        """

        return "\n".join(self.lines)

    def __str__(self):
        return self.build()