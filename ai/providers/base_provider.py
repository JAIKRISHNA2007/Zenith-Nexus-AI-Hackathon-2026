from abc import ABC, abstractmethod


class BaseProvider(ABC):

    @abstractmethod
    def get_llm(self):
        pass

    @abstractmethod
    def generate(self, prompt: str) -> str:
        pass