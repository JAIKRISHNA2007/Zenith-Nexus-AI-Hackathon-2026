from typing import Union, Dict, Any

from langchain_core.tools import tool

from backend.app.services.schema_service import get_compact_schema_string


@tool
def get_schema() -> str:
    """
    Retrieve the complete database schema including tables, columns,
    and relationships.

    Use this tool BEFORE generating SQL whenever database structure
    is required.
    """
    try:
        return get_compact_schema_string()
    except Exception as e:
        return f"Error retrieving schema: {str(e)}"