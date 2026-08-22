from backend.config import settings
from backend.llm.base import BaseLLMClient
from backend.llm.gemini_client import GeminiClient
from backend.llm.openai_client import OpenAIClient
from backend.llm.anthropic_client import AnthropicClient
from backend.llm.mock_client import MockLLMClient

def get_llm_client() -> BaseLLMClient:
    provider = settings.LLM_PROVIDER.lower().strip()
    
    if provider == "gemini":
        if settings.GEMINI_API_KEY:
            return GeminiClient(api_key=settings.GEMINI_API_KEY, model=settings.GEMINI_MODEL)
        print("WARNING: LLM_PROVIDER is set to 'gemini' but GEMINI_API_KEY is missing. Falling back to MockLLMClient.")
        return MockLLMClient()
        
    elif provider in ("openai", "groq", "deepseek", "openrouter"):
        if settings.OPENAI_API_KEY:
            return OpenAIClient(
                api_key=settings.OPENAI_API_KEY,
                model=settings.OPENAI_MODEL,
                base_url=settings.OPENAI_BASE_URL if settings.OPENAI_BASE_URL else None
            )
        print(f"WARNING: LLM_PROVIDER is set to '{provider}' but OPENAI_API_KEY is missing. Falling back to MockLLMClient.")
        return MockLLMClient()
        
    elif provider == "anthropic":
        if settings.ANTHROPIC_API_KEY:
            return AnthropicClient(api_key=settings.ANTHROPIC_API_KEY, model=settings.ANTHROPIC_MODEL)
        print("WARNING: LLM_PROVIDER is set to 'anthropic' but ANTHROPIC_API_KEY is missing. Falling back to MockLLMClient.")
        return MockLLMClient()
        
    elif provider == "mock":
        return MockLLMClient()
        
    else:
        # Default auto-detect: if gemini key is present, use gemini; if openai key present, use openai; else mock
        if settings.GEMINI_API_KEY:
            return GeminiClient(api_key=settings.GEMINI_API_KEY, model=settings.GEMINI_MODEL)
        elif settings.OPENAI_API_KEY:
            return OpenAIClient(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL, base_url=settings.OPENAI_BASE_URL or None)
        elif settings.ANTHROPIC_API_KEY:
            return AnthropicClient(api_key=settings.ANTHROPIC_API_KEY, model=settings.ANTHROPIC_MODEL)
        return MockLLMClient()
