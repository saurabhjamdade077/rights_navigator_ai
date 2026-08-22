import json
import re
import httpx
from typing import Dict, Any, List, Optional
from backend.llm.base import BaseLLMClient
from backend.models import ChatMessage

class AnthropicClient(BaseLLMClient):
    def __init__(self, api_key: str, model: str = "claude-3-5-haiku-20241022"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.anthropic.com/v1/messages"

    @property
    def provider_name(self) -> str:
        return f"Anthropic Claude ({self.model})"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        prompt = (
            f"{user_prompt}\n\n"
            "CRITICAL: Return ONLY a valid JSON object matching the requested fields. "
            "Do NOT include any introduction, explanations, or conversational markdown outside the JSON block."
        )
        
        payload = {
            "model": self.model,
            "system": system_prompt,
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            raw_text = data["content"][0]["text"]
            raw_text = re.sub(r"^```json\s*", "", raw_text.strip())
            raw_text = re.sub(r"\s*```$", "", raw_text)
            return json.loads(raw_text)

    async def chat(
        self,
        system_prompt: str,
        messages: List[ChatMessage],
        user_message: str
    ) -> str:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        formatted_msgs = []
        for msg in messages:
            role = "assistant" if msg.role == "assistant" else "user"
            formatted_msgs.append({"role": role, "content": msg.content})
        formatted_msgs.append({"role": "user", "content": user_message})
        
        payload = {
            "model": self.model,
            "system": system_prompt,
            "max_tokens": 2048,
            "messages": formatted_msgs,
            "temperature": 0.4
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"]
