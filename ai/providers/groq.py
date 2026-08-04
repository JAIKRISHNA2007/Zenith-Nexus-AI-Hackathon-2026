from langchain_groq import ChatGroq

from ai.config.settings import GROQ_API_KEY, GROQ_MODEL
from ai.providers.base_provider import BaseProvider


class GroqProvider(BaseProvider):

    def __init__(self):
        self.llm = ChatGroq(
            model=GROQ_MODEL,
            api_key=GROQ_API_KEY,
            temperature=0,
        )

    def get_llm(self):
        return self.llm

    def generate(self, prompt: str) -> str:
        response = self.llm.invoke(prompt)

        if isinstance(response.content, list):
            return response.content[0]["text"]

        return response.content