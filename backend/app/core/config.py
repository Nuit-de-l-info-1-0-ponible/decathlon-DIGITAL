class Settings:
    PROJECT_NAME: str = "Decathlon AI Sportive Platform"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/decathlon_db" # Default fallback
    
    # In production/docker, this will be overridden by env var
    class Config:
        env_file = ".env"

settings = Settings()
