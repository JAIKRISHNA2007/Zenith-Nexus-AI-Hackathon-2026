from langchain_core.tools import tool

from ai.schemas import FlowchartSchema


@tool
def generate_flowchart(
    diagram_type: str,
    content: str,
) -> dict:
    """
    Generate a Mermaid diagram.

    Rules:
    - Database relationships -> ER Diagram
    - Business process -> Flowchart
    - Decision making -> Decision Tree

    If the user explicitly requests a diagram type,
    always use that type.

    The 'content' MUST be valid Mermaid syntax, for example:
    - ER: erDiagram\\n  CUSTOMER ||--o{ ORDER : places\\n  ORDER ||--|{ LINE-ITEM : contains
    - Flowchart: graph TD\\n  A[Start] --> B{Decision}\\n  B -->|Yes| C[End]
    - Decision Tree: graph TD\\n  A{Condition} -->|True| B[Action]\\n  A -->|False| C[Other]
    """
    try:
        diagram_type_clean = str(diagram_type).lower().strip()

        valid = {
            "flowchart",
            "er",
            "decision-tree",
        }
        if diagram_type_clean not in valid:
            # Try some common synonyms
            if diagram_type_clean in {"entity-relationship", "erd", "entity_relationship"}:
                diagram_type_clean = "er"
            elif diagram_type_clean in {"flow", "process", "bpmn", "pipeline"}:
                diagram_type_clean = "flowchart"
            elif diagram_type_clean in {"decision", "tree", "decision_tree"}:
                diagram_type_clean = "decision-tree"
            else:
                diagram_type_clean = "flowchart"

        # Strip any markdown fences the model might have accidentally added
        mermaid_content = str(content).strip()
        if mermaid_content.startswith("```mermaid"):
            mermaid_content = mermaid_content[len("```mermaid"):].strip()
        elif mermaid_content.startswith("```"):
            mermaid_content = mermaid_content[3:].strip()
        if mermaid_content.endswith("```"):
            mermaid_content = mermaid_content[:-3].strip()

        diagram = FlowchartSchema(
            diagram_type=diagram_type_clean,
            content=mermaid_content,
        )

        return diagram.model_dump()
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
        }