import aiohttp
import asyncio
from typing import Dict, Optional
from datetime import datetime
from app.core.config import settings
from app.models.models import AirQualityReport, Location
from sqlalchemy.orm import Session

class AirQualityService:
    def __init__(self):
        self.api_key = settings.AIR_QUALITY_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5/air_pollution"
    
    async def get_air_quality_data(self, lat: float, lon: float) -> Optional[Dict]:
        """Fetch air quality data from OpenWeatherMap API"""
        url = f"{self.base_url}?lat={lat}&lon={lon}&appid={self.api_key}"
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_air_quality_data(data)
                    else:
                        print(f"Error fetching air quality data: {response.status}")
                        return None
            except Exception as e:
                print(f"Exception while fetching air quality data: {e}")
                return None

    def _process_air_quality_data(self, data: Dict) -> Dict:
        """Process the raw API response into our format"""
        if not data or 'list' not in data or not data['list']:
            return None
        
        aqi_data = data['list'][0]['components']
        aqi_level = data['list'][0]['main']['aqi']
        
        return {
            'aqi': self._calculate_us_aqi(aqi_data),
            'raw_aqi': aqi_level,
            'pm25': aqi_data.get('pm2_5', 0),
            'pm10': aqi_data.get('pm10', 0),
            'o3': aqi_data.get('o3', 0),
            'no2': aqi_data.get('no2', 0),
            'so2': aqi_data.get('so2', 0),
            'co': aqi_data.get('co', 0)
        }

    def _calculate_us_aqi(self, components: Dict) -> float:
        """Calculate US AQI from pollutant concentrations"""
        # This is a simplified calculation - you might want to implement
        # the full EPA algorithm for production use
        pm25 = components.get('pm2_5', 0)
        if pm25 <= 12.0:
            return (50 - 0) * (pm25 - 0) / (12.0 - 0) + 0
        elif pm25 <= 35.4:
            return (100 - 51) * (pm25 - 12.1) / (35.4 - 12.1) + 51
        elif pm25 <= 55.4:
            return (150 - 101) * (pm25 - 35.5) / (55.4 - 35.5) + 101
        elif pm25 <= 150.4:
            return (200 - 151) * (pm25 - 55.5) / (150.4 - 55.5) + 151
        elif pm25 <= 250.4:
            return (300 - 201) * (pm25 - 150.5) / (250.4 - 150.5) + 201
        else:
            return (500 - 301) * (pm25 - 250.5) / (500.4 - 250.5) + 301

    async def save_air_quality_report(
        self, 
        db: Session,
        lat: float,
        lon: float,
        city: str,
        state: str,
        country: str,
        user_id: int
    ) -> Optional[AirQualityReport]:
        """Fetch air quality data and save it to the database"""
        try:
            # Get air quality data from API
            air_quality_data = await self.get_air_quality_data(lat, lon)
            if not air_quality_data:
                return None

            # Create or get location
            location = db.query(Location).filter_by(
                city=city,
                state=state,
                country=country,
                latitude=lat,
                longitude=lon
            ).first()

            if not location:
                location = Location(
                    city=city,
                    state=state,
                    country=country,
                    latitude=lat,
                    longitude=lon
                )
                db.add(location)
                db.flush()

            # Create air quality report
            report = AirQualityReport(
                aqi=air_quality_data['aqi'],
                pm25=air_quality_data['pm25'],
                pm10=air_quality_data['pm10'],
                o3=air_quality_data['o3'],
                no2=air_quality_data['no2'],
                so2=air_quality_data['so2'],
                co=air_quality_data['co'],
                user_id=user_id,
                location_id=location.id,
                timestamp=datetime.utcnow()
            )
            
            db.add(report)
            db.commit()
            return report

        except Exception as e:
            print(f"Error saving air quality report: {e}")
            db.rollback()
            return None
