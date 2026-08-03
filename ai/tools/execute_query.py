from typing import Dict, Any
from langchain_core.tools import tool


@tool
def execute_query(sql_query: str) -> Dict[str, Any]:
    """
    Executes a SQL query.
    Currently returns mock data.
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