from langchain_openai import ChatOpenAI
from ai.config.settings import OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL
from ai.providers.base_provider import BaseProvider


class SingleCallChatOpenAI(ChatOpenAI):
    def bind_tools(self, *args, **kwargs):
        kwargs["parallel_tool_calls"] = False
        return super().bind_tools(*args, **kwargs)


class OpenRouterProvider(BaseProvider):

    def __init__(self):
        api_key = OPENROUTER_API_KEY
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY is required to initialize the OpenRouter provider.")
        self.llm = SingleCallChatOpenAI(
            model=OPENROUTER_MODEL,
            api_key=api_key,
            base_url=OPENROUTER_BASE_URL,
            temperature=0.1,
        )

    def get_llm(self):
        return self.llm

    def generate(self, prompt: str) -> str:
        response = self.llm.invoke(prompt)
        if isinstance(response.content, list):
            return response.content[0].get("text", "") if response.content else ""
        return str(response.content)
