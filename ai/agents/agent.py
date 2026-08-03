from langchain_google_genai import ChatGoogleGenerativeAI

from ai.config.settings import GEMINI_API_KEY, MODEL_NAME
from ai.tools.get_schema import get_schema
from ai.tools.execute_query import execute_query
from ai.tools.generate_chart import generate_chart
from ai.tools.generate_flowchart import generate_flowchart
from ai.tools.explain_data import explain_data


class AIAgent:
    def __init__(self):

        self.tools = [
            get_schema,
            execute_query,
            generate_chart,
            generate_flowchart,
            explain_data,
        ]

        llm = ChatGoogleGenerativeAI(
            model=MODEL_NAME,
            google_api_key=GEMINI_API_KEY,
            temperature=0,
        )

        self.llm = llm.bind_tools(self.tools)

    def chat(self, message: str):

        response = self.llm.invoke(message)

        return response