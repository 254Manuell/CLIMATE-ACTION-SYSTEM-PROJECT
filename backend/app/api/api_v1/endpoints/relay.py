from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

router = APIRouter()

@router.get("/status")
def get_relay_status():
    """
    Check relay connection status using API key
    """
    return {"status": "connected", "api_key": settings.RELAY_API_KEY[:8] + "..."}
