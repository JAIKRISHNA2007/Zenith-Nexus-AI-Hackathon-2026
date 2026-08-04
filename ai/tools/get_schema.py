from typing import Dict, Any

from langchain_core.tools import tool

from ai.utils.error_handler import tool_error_handler


@tool
@tool_error_handler
def get_schema() -> Dict[str, Any]:
    """
    Retrieve the complete database schema including tables, columns,
    and relationships.

    Use this tool BEFORE generating SQL whenever database structure
    is required.
    """

    return {
        "tables": [
            {
                "name": "customers",
                "columns": [
                    "customer_id",
                    "name",
                    "email",
                    "city"
                ]
            },
            {
                "name": "products",
                "columns": [
                    "product_id",
                    "product_name",
                    "price"
                ]
            },
            {
                "name": "orders",
                "columns": [
                    "order_id",
                    "customer_id",
                    "product_id",
                    "quantity",
                    "order_date"
                ]
            }
        ]
    }