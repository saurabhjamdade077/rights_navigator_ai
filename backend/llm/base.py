from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from backend.models import ChatMessage

class BaseLLMClient(ABC):
    """
    Abstract interface for LLM providers.
    Supports swapping providers (Gemini, OpenAI, Anthropic, Groq, Mock) seamlessly.
    """
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a structured JSON response matching the expected schema.
        """
        pass

    @abstractmethod
    async def chat(
        self,
        system_prompt: str,
        messages: List[ChatMessage],
        user_message: str
    ) -> str:
        """
        Conduct a multi-turn chat conversation.
        """
        pass
