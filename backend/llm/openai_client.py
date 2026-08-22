import json
import re
import httpx
from typing import Dict, Any, List, Optional
from backend.llm.base import BaseLLMClient
from backend.models import ChatMessage

class OpenAIClient(BaseLLMClient):
    def __init__(self, api_key: str, model: str = "gpt-4o-mini", base_url: Optional[str] = None):
        self.api_key = api_key
        self.model = model
        self.base_url = (base_url.rstrip("/") if base_url else "https://api.openai.com/v1") + "/chat/completions"

    @property
    def provider_name(self) -> str:
        return f"OpenAI / Compatible ({self.model})"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": f"{system_prompt}\n\nIMPORTANT: Output strictly a valid JSON object matching the requested schema. Do not enclose in anything other than valid JSON."},
                {"role": "user", "content": user_prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            raw_text = data["choices"][0]["message"]["content"]
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
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        formatted_msgs = [{"role": "system", "content": system_prompt}]
        for msg in messages:
            formatted_msgs.append({"role": msg.role, "content": msg.content})
        formatted_msgs.append({"role": "user", "content": user_message})
        
        payload = {
            "model": self.model,
            "messages": formatted_msgs,
            "temperature": 0.4
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
