from langchain_groq import ChatGroq
from ai.config.settings import GROQ_API_KEY, GROQ_MODEL
from ai.providers.base_provider import BaseProvider


class GroqProvider(BaseProvider):

    def __init__(self):
        api_key = GROQ_API_KEY or "dummy-key"
        self.llm = ChatGroq(
            model_name=GROQ_MODEL,
            groq_api_key=api_key,
            temperature=0.1,
        )

    def get_llm(self):
        return self.llm

    def generate(self, prompt: str) -> str:
        response = self.llm.invoke(prompt)
        if isinstance(response.content, list):
            return response.content[0].get("text", "") if response.content else ""
        return str(response.content)
