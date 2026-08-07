from langchain_core.tools import tool

from ai.providers.gemini import GeminiProvider
from ai.utils.error_handler import tool_error_handler


provider = GeminiProvider()


@tool
@tool_error_handler
def explain_data(data: list) -> str:
    """
    Analyze query results and explain the insights
    in clear business language.

    Highlight important trends,
    patterns and recommendations.
    """

    prompt = f"""
You are a Business Intelligence Analyst.

Explain these query results.

Data:
{data}

Provide:

1. Executive Summary

2. Key Insights

3. Business Recommendations
"""

    return provider.generate(prompt)