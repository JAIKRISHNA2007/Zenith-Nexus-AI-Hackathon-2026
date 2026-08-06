from typing import Dict, Any

from langchain_core.tools import tool

from ai.utils.error_handler import tool_error_handler
from backend.app.services.query_service import execute_query as backend_execute_query


@tool
@tool_error_handler
def execute_query(sql_query: str) -> Dict[str, Any]:
    """
    Execute a SQL query against the database.

    Input:
    - SQL query

    Output:
    - Query results as JSON.
    """

    print(f"\nExecuting SQL:\n{sql_query}\n")

    result = backend_execute_query(sql_query)

    return {
        "status": "success",
        "rows": result.get("rows", [])
    }