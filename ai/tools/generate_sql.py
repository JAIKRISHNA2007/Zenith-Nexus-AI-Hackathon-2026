from langchain_core.tools import tool

from ai.providers.gemini import GeminiProvider
from ai.tools.get_schema import get_schema


provider = GeminiProvider()


@tool
def generate_sql(user_query: str) -> str:
    """
    Convert a natural language business question into SQL.

    Always inspect the database schema before generating SQL.

    Return only the SQL query.
    """

    schema = get_schema.invoke({})

    prompt = f"""
You are an expert SQL generator.

Database Schema:
{schema}

Rules:
- Generate ONLY SQL.
- Do not explain anything.
- Do not use markdown.
- Return a valid SQL query.

User Question:
{user_query}
print("\n========== SQL PROMPT ==========\n")
print(prompt)
"""

    sql = provider.generate(prompt)

    return sql.strip()