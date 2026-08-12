import logging
from ai.config.settings import (
    LLM_PROVIDER,
    NVIDIA_NIM_API_KEY,
    NVIDIA_NIM_MODEL,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GROQ_API_KEY,
    GROQ_MODEL,
)
from ai.providers.base_provider import BaseProvider

logger = logging.getLogger(__name__)


def get_provider() -> BaseProvider:
    provider_name = (LLM_PROVIDER or "groq").lower().strip()

    if provider_name in ["nvidia", "nvidia_nim", "nim", "nemotron"]:
        if not NVIDIA_NIM_API_KEY:
            err_msg = "NVIDIA NIM API key missing (NVIDIA_NIM_API_KEY)."
            logger.error(err_msg)
            raise ValueError(err_msg)
        try:
            from ai.providers.nvidia_nim import NvidiaNimProvider

            provider = NvidiaNimProvider()
            logger.info(f"Active LLM Provider: NVIDIA NIM | Active Model: {NVIDIA_NIM_MODEL}")
            print(f"[LLM Factory] Active LLM Provider: NVIDIA NIM | Active Model: {NVIDIA_NIM_MODEL}")
            return provider
        except Exception as e:
            err_msg = f"Failed to initialize NVIDIA NIM provider ({NVIDIA_NIM_MODEL}): {e}"
            logger.error(err_msg)
            raise RuntimeError(err_msg) from e

    elif provider_name == "groq":
        if not GROQ_API_KEY:
            err_msg = "Groq API key missing (GROQ_API_KEY)."
            logger.error(err_msg)
            raise ValueError(err_msg)
        try:
            from ai.providers.groq_provider import GroqProvider

            provider = GroqProvider()
            logger.info(f"Active LLM Provider: Groq | Active Model: {GROQ_MODEL}")
            print(f"[LLM Factory] Active LLM Provider: Groq | Active Model: {GROQ_MODEL}")
            return provider
        except Exception as e:
            err_msg = f"Failed to initialize Groq provider ({GROQ_MODEL}): {e}"
            logger.error(err_msg)
            raise RuntimeError(err_msg) from e

    elif provider_name == "gemini":
        if not GEMINI_API_KEY:
            err_msg = "Gemini API key missing (GEMINI_API_KEY)."
            logger.error(err_msg)
            raise ValueError(err_msg)
        try:
            from ai.providers.gemini import GeminiProvider

            provider = GeminiProvider()
            logger.info(f"Active LLM Provider: Gemini | Active Model: {GEMINI_MODEL}")
            print(f"[LLM Factory] Active LLM Provider: Gemini | Active Model: {GEMINI_MODEL}")
            return provider
        except Exception as e:
            err_msg = f"Failed to initialize Gemini provider ({GEMINI_MODEL}): {e}"
            logger.error(err_msg)
            raise RuntimeError(err_msg) from e

    # General auto-detection fallback if LLM_PROVIDER is unrecognised
    logger.warning(f"Unknown LLM_PROVIDER '{LLM_PROVIDER}', attempting default provider detection.")
    if NVIDIA_NIM_API_KEY:
        from ai.providers.nvidia_nim import NvidiaNimProvider
        logger.info(f"Active LLM Provider: NVIDIA NIM | Active Model: {NVIDIA_NIM_MODEL}")
        return NvidiaNimProvider()
    elif GROQ_API_KEY:
        from ai.providers.groq_provider import GroqProvider
        logger.info(f"Active LLM Provider: Groq | Active Model: {GROQ_MODEL}")
        return GroqProvider()
    else:
        from ai.providers.gemini import GeminiProvider
        logger.info(f"Active LLM Provider: Gemini | Active Model: {GEMINI_MODEL}")
        return GeminiProvider()

