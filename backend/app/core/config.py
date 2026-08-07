from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool

    DATABASE_URL: str
    API_PREFIX: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
    )

settings = Settings()