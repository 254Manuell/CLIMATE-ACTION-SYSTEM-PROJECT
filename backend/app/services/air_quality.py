import aiohttp
from app.core.config import settings
from typing import Dict, Any, Optional
from fastapi import HTTPException
from app.core.config import settings
import httpx
from datetime import datetime

class AirQualityData:
    def __init__(self, data: Dict[str, Any]):
        self.aqi = data.get('aqi')
        self.components = data.get('components', {})
        self.timestamp = data.get('timestamp', datetime.now().isoformat())
        self.location = data.get('location', '')

    def to_dict(self) -> Dict[str, Any]:
        return {
            'aqi': self.aqi,
            'components': self.components,
            'timestamp': self.timestamp,
            'location': self.location
        }

    @staticmethod
    def validate_coordinates(lat: float, lon: float) -> None:
        if not (-90 <= lat <= 90):
            raise ValueError(f"Invalid latitude: {lat}. Must be between -90 and 90.")
        if not (-180 <= lon <= 180):
            raise ValueError(f"Invalid longitude: {lon}. Must be between -180 and 180.")

class AirQualityService:
    def __init__(self):
        self.api_key = settings.AIR_QUALITY_API_KEY
        self.base_url = settings.AIR_QUALITY_API_URL
        self._cache: Dict[str, AirQualityData] = {}
        self._cache_duration = 300  # 5 minutes

    def _get_cache_key(self, lat: float, lon: float) -> str:
        return f"{lat:.4f},{lon:.4f}"

    async def get_air_quality(self, lat: float, lon: float) -> Dict[str, Any]:
        try:
            # Validate coordinates
            AirQualityData.validate_coordinates(lat, lon)

            # Check cache
            cache_key = self._get_cache_key(lat, lon)
            cached_data = self._cache.get(cache_key)
            if cached_data:
                return cached_data.to_dict()

            # Fetch new data
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/air_quality",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "key": self.api_key
                    }
                )

                if response.status_code == 429:
                    raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
                
                response.raise_for_status()
                data = response.json()

                # Process and cache the data
                air_quality_data = AirQualityData(data)
                self._cache[cache_key] = air_quality_data
                return air_quality_data.to_dict()

        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request timeout. Please try again.")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Error fetching air quality data: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def get_air_quality_data(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetch air quality data from OpenWeatherMap API
    """
    air_quality_service = AirQualityService()
    return await air_quality_service.get_air_quality(latitude, longitude)
