from typing import Dict, Any
from langchain_core.tools import tool

from ai.providers.gemini import GeminiProvider


@tool
def explain_data(data: Dict[str, Any]) -> str:
    """
    Uses Gemini to explain query results in natural language.
    """

    gemini = GeminiProvider()

    prompt = f"""
You are a business analyst.

Explain the following query result in simple English.

Data:
{data}
"""

    return gemini.generate(prompt)