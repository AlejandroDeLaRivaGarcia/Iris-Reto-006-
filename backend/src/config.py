from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./iris.db"

    EVOLUTION_API_URL: str
    EVOLUTION_API_KEY: str

    model_config = {"env_file": ".env"}

settings = Settings()
