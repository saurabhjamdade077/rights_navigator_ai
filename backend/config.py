import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from root or backend
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")

class Settings:
    APP_NAME: str = "Rights Navigator"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # LLM Provider configuration: "mock", "gemini", "openai", "groq", "anthropic"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock").lower()
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "") # e.g. for Groq / DeepSeek / Ollama
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Model Names
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-20241022")
    
    # Data directory
    DATA_DIR: Path = BACKEND_DIR / "data"

settings = Settings()
