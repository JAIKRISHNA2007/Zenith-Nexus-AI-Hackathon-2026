from typing import Dict, Any

from langchain_core.tools import tool

from ai.utils.error_handler import tool_error_handler
from backend.app.services.schema_service import get_database_schema


@tool
@tool_error_handler
def get_schema() -> Dict[str, Any]:
    """
    Retrieve the complete database schema including tables, columns,
    and relationships.

    Use this tool BEFORE generating SQL whenever database structure
    is required.
    """

    return get_database_schema()