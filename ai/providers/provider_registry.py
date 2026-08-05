from ai.providers.gemini import GeminiProvider
from ai.providers.groq import GroqProvider


PROVIDER_REGISTRY = {
    "gemini": GeminiProvider,
    "groq": GroqProvider,
}