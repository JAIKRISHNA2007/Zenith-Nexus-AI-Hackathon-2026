from langchain_google_genai import ChatGoogleGenerativeAI

from ai.config.settings import GEMINI_API_KEY, GEMINI_MODEL
from ai.providers.base_provider import BaseProvider


class GeminiProvider(BaseProvider):

    def __init__(self):
        api_key = GEMINI_API_KEY or "dummy-key"
        self.llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            google_api_key=api_key,
            temperature=0,
        )

    def get_llm(self):
        return self.llm

    def generate(self, prompt: str) -> str:
        response = self.llm.invoke(prompt)

        if isinstance(response.content, list):
            return response.content[0]["text"]

        return response.content