import json
import re
import httpx
from typing import Dict, Any, List, Optional
from backend.llm.base import BaseLLMClient
from backend.models import ChatMessage

class GeminiClient(BaseLLMClient):
    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    @property
    def provider_name(self) -> str:
        return f"Google Gemini ({self.model})"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": f"{system_prompt}\n\nUSER DISPUTE QUERY:\n{user_prompt}\n\nIMPORTANT: Return strictly a valid JSON object."}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            url = f"{self.base_url}?key={self.api_key}"
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Extract text from Gemini structure
            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("Empty response received from Gemini API")
            
            raw_text = candidates[0]["content"]["parts"][0]["text"]
            # Clean markdown JSON wraps if present
            raw_text = re.sub(r"^```json\s*", "", raw_text.strip())
            raw_text = re.sub(r"\s*```$", "", raw_text)
            return json.loads(raw_text)

    async def chat(
        self,
        system_prompt: str,
        messages: List[ChatMessage],
        user_message: str
    ) -> str:
        contents = []
        for msg in messages:
            role = "model" if msg.role == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": msg.content}]})
        
        # Append latest user message
        contents.append({"role": "user", "parts": [{"text": user_message}]})
        
        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": contents,
            "generationConfig": {"temperature": 0.4}
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            url = f"{self.base_url}?key={self.api_key}"
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
