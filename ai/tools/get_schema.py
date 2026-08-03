from typing import Dict, Any
from langchain_core.tools import tool


@tool
def get_schema() -> Dict[str, Any]:
    """
    Returns the database schema.
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