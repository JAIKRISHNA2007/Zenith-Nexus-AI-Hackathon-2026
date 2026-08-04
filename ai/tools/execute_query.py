from typing import Dict, Any

from langchain_core.tools import tool

from ai.utils.error_handler import tool_error_handler


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

    return {
        "status": "success",
        "rows": [
            {
                "product_name": "Laptop",
                "revenue": 250000
            },
            {
                "product_name": "Mouse",
                "revenue": 120000
            },
            {
                "product_name": "Keyboard",
                "revenue": 90000
            }
        ]
    }