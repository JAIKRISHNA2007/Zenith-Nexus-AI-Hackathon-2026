from langchain_core.tools import tool
import re

from ai.providers.factory import get_provider
from backend.app.services.schema_service import get_compact_schema_string


@tool
def generate_sql(user_query: str) -> str:
    """
    Convert a natural language business question into SQL.

    Always inspect the database schema before generating SQL.

    Return only the SQL query.
    """
    try:
        # Call the schema service directly to avoid tool invocation overhead
        schema = get_compact_schema_string()

        prompt = f"""
You are an expert SQL generator.

Database Schema:
{schema}

Rules:
- Generate ONLY SQL.
- Do not explain anything.
- Do not use markdown formatting or code blocks.
- Return a valid SQL query.
- IMPORTANT: When asked for top items, rankings, trends, or comparisons, you MUST SELECT BOTH the descriptive column (e.g., name) AND the numeric metric (e.g., revenue, count). A chart cannot be drawn without numbers!

User Question:
{user_query}
"""

        provider = get_provider()
        sql = provider.generate(prompt)

        # Strip markdown code fences if model accidentally wraps with ```sql ... ```
        sql = sql.strip()
        sql = re.sub(r"^```sql\s*", "", sql, flags=re.IGNORECASE)
        sql = re.sub(r"^```\s*", "", sql)
        sql = re.sub(r"\s*```$", "", sql)
        sql = sql.strip()

        # Remove trailing semicolon (added back later by query_service if needed)
        if sql.endswith(";"):
            sql = sql[:-1].strip()

        return sql
    except Exception as e:
        return f"Error generating SQL: {str(e)}"