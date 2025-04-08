from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.services.air_quality_service import AirQualityService
from app.models.models import User, AirQualityReport
from pydantic import BaseModel, Field

router = APIRouter()
air_quality_service = AirQualityService()

class AirQualityRequest(BaseModel):
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class AirQualityResponse(BaseModel):
    id: int
    aqi: float
    pm25: Optional[float]
    pm10: Optional[float]
    o3: Optional[float]
    no2: Optional[float]
    so2: Optional[float]
    co: Optional[float]
    city: str
    state: str
    country: str
    timestamp: str

    class Config:
        orm_mode = True

@router.post("/reports", response_model=AirQualityResponse)
async def create_air_quality_report(
    request: AirQualityRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new air quality report"""
    report = await air_quality_service.save_air_quality_report(
        db=db,
        lat=request.latitude,
        lon=request.longitude,
        city=request.city,
        state=request.state,
        country=request.country,
        user_id=current_user.id
    )
    
    if not report:
        raise HTTPException(
            status_code=500,
            detail="Failed to create air quality report"
        )
    
    return report

@router.get("/reports", response_model=List[AirQualityResponse])
async def get_air_quality_reports(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get air quality reports for the current user"""
    reports = (
        db.query(AirQualityReport)
        .filter(AirQualityReport.user_id == current_user.id)
        .order_by(AirQualityReport.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return reports

@router.get("/reports/latest", response_model=AirQualityResponse)
async def get_latest_air_quality(
    latitude: float = Field(..., ge=-90, le=90),
    longitude: float = Field(..., ge=-180, le=180),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get latest air quality data for a location"""
    data = await air_quality_service.get_air_quality_data(latitude, longitude)
    if not data:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch air quality data"
        )
    return data
