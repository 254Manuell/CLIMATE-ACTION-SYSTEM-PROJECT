from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Climate Action System"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for Climate Action System"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Default Next.js port
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004"
    ]
    
    # Database Configuration
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "climate_action_db"
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key"  # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Relay API Configuration
    RELAY_API_KEY: str = "b2b2cd6e-a742-49eb-986a-ea80b0c39a07"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
