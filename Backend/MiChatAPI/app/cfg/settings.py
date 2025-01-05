from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    API_BASE_PORT: int

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str

    JWT_ACCESS_TOKEN_LIFETIME_MINUTES: int
    JWT_REFRESH_TOKEN_LIFETIME_HOURS: int
    
    class Config:
        env_file = ".env"    
    
    @property
    def db_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
settings: Settings = Settings()