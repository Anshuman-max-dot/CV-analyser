import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SMARRTIF AI — AI Career Profile Analyzer"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/smarrtif_ai")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
