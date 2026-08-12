import json
from langchain_core.tools import tool

from ai.providers.factory import get_provider


@tool
def explain_data(data: list | str | dict) -> str:
    """
    Analyze query results and explain the insights
    in clear business language.

    Highlight important trends,
    patterns and recommendations.
    """
    try:
        # Normalise data: LLMs sometimes pass a JSON string or a dict with 'rows'
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (json.JSONDecodeError, ValueError):
                import ast
                try:
                    data = ast.literal_eval(data)
                except (ValueError, SyntaxError):
                    data = []

        # If data is a dict with a 'rows' key, unwrap it
        if isinstance(data, dict):
            data = data.get("rows", data.get("data", []))

        if not isinstance(data, list):
            data = []

        capped_data = data[:15]

        if not capped_data:
            return "No data available to analyze."

        prompt = f"""
You are a Business Intelligence Analyst.

Explain these query results.

Data:
{capped_data}

Provide:

1. Executive Summary

2. Key Insights

3. Business Recommendations
"""
        return get_provider().generate(prompt)
    except Exception as e:
        return f"Error generating explanation: {str(e)}"