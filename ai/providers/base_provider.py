from abc import ABC, abstractmethod


class BaseProvider(ABC):

    @abstractmethod
    def get_llm(self):
        """
        Returns the LangChain LLM object.
        """
        pass

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Generates a text response.
        """
        pass