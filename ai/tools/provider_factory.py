import os

from dotenv import load_dotenv

from ai.providers.provider_registry import PROVIDER_REGISTRY

load_dotenv()


def get_provider():

    provider_name = os.getenv(
        "LLM_PROVIDER",
        "gemini"
    ).lower()

    provider_class = PROVIDER_REGISTRY.get(provider_name)

    if provider_class is None:
        raise ValueError(
            f"Unsupported provider: {provider_name}"
        )

    return provider_class()