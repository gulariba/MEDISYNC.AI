import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings and configuration"""

    # Application
    app_name: str = "Healthcare Multi-Agent System"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database
    database_url: str
    db_pool_size: int = 10
    db_max_overflow: int = 20

    # Redis
    redis_url: str
    redis_ttl_default: int = 3600  # 1 hour

    # OpenRouter API
    openrouter_api_key: str
    openrouter_max_tokens: int = 4096

    # Security
    secret_key: str = "your-secret-key-change-in-production"
    allowed_origins: list = ["*"]

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds

    # Logging
    log_level: str = "INFO"
    log_file: str = "logs/healthcare_system.log"

    # Agent Configuration
    agent_timeout: int = 30  # seconds
    agent_retry_attempts: int = 3

    # HIPAA Compliance
    enable_audit_logging: bool = True
    enable_data_encryption: bool = False
    phi_masking_enabled: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Expose settings
settings = get_settings()
