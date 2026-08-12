from typing import Dict, Any

from langchain_core.tools import tool

from backend.app.services.query_service import execute_query as backend_execute_query


@tool
def execute_query(sql_query: str) -> Dict[str, Any]:
    """
    Execute a SQL query against the database.

    Input:
    - SQL query

    Output:
    - Query results as JSON.
    """
    try:
        print(f"\nExecuting SQL:\n{sql_query}\n")

        result = backend_execute_query(sql_query)
        if "error" in result:
            return {
                "status": "error",
                "error": result["error"],
                "rows": [],
            }

        all_rows = result.get("rows", [])
        capped_rows = all_rows[:20] if isinstance(all_rows, list) else []

        return {
            "status": "success",
            "sql": result.get("sql", sql_query),
            "columns": result.get("columns", []),
            "rows": capped_rows,
            "row_count": len(all_rows),
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "rows": [],
        }