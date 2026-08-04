import os

from dotenv import load_dotenv

from ai.providers.provider_registry import PROVIDER_REGISTRY


load_dotenv()


def get_provider():
    """
    Return the configured LLM provider.

    The provider is selected using the
    LLM_PROVIDER environment variable.
    """

    provider_name = os.getenv("LLM_PROVIDER", "gemini").lower()

    provider_class = PROVIDER_REGISTRY.get(provider_name)

    if provider_class is None:
        raise ValueError(
            f"Unsupported provider: {provider_name}"
        )

    return provider_class()