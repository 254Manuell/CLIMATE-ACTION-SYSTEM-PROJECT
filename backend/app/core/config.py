from typing import List
from pydantic import BaseSettings
from pydantic import AnyHttpUrl
from dotenv import load_dotenv
import os
import secrets

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Climate Action System"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for Climate Action System"
    API_V1_STR: str = "/api/v1"
    
    # Air Quality API Configuration
    AIR_QUALITY_API_URL: str = "http://api.openweathermap.org/data/2.5/air_pollution"
    AIR_QUALITY_API_KEY: str = os.getenv("AIR_QUALITY_API_KEY", "")  # OpenWeatherMap API key
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Default Next.js port
        "https://climate-action-system-project.vercel.app",  # Production frontend URL
        "https://climate-action-system-project-969abxnkd.vercel.app",  # Preview URL
        "https://climate-action-system-project-h0olb07zl.vercel.app"  # Another preview URL
    ]
    
    # Database Configuration
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "climate_action_db")
    
    @property
    def get_database_url(self) -> str:
        """Get database URL with proper SSL mode for production"""
        url = f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        if 'railway.app' in self.MYSQL_HOST or os.getenv('ENVIRONMENT') == 'production':
            # Add SSL mode for production database
            if '?' not in url:
                url += '?ssl_mode=REQUIRED'
            else:
                url += '&ssl_mode=REQUIRED'
        return url
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-local-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Relay API Configuration
    RELAY_API_KEY: str = "b2b2cd6e-a742-49eb-986a-ea80b0c39a07"
    
    # FastAPI Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Climate Action System"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for Climate Action System"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
