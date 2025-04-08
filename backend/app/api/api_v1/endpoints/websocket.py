from fastapi import APIRouter, WebSocket, Depends, HTTPException, WebSocketDisconnect, Query
from typing import Dict, Any
from app.services.air_quality import get_air_quality_data, AirQualityService
from app.core.auth import get_current_user_ws
from datetime import datetime
import asyncio
import logging
import json

router = APIRouter()
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, Any]] = {}
        self.air_quality_service = AirQualityService()

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = {
            'websocket': websocket,
            'update_task': None
        }

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            if self.active_connections[client_id]['update_task']:
                self.active_connections[client_id]['update_task'].cancel()
            del self.active_connections[client_id]

    async def update_air_quality(self, client_id: str, lat: float, lon: float):
        if client_id not in self.active_connections:
            return

        websocket = self.active_connections[client_id]['websocket']
        try:
            air_quality = await self.air_quality_service.get_air_quality(lat, lon)
            
            # Add timestamp and location info
            air_quality['timestamp'] = datetime.now().isoformat()
            air_quality['location'] = {'lat': lat, 'lon': lon}
            
            await websocket.send_json({
                'type': 'air_quality_update',
                'data': air_quality
            })
        except Exception as e:
            logger.error(f"Error updating air quality for client {client_id}: {str(e)}")
            await websocket.send_json({
                'type': 'error',
                'message': str(e)
            })

manager = ConnectionManager()

@router.websocket("/ws/air-quality")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Depends(get_current_user_ws)
):
    client_id = token  # Use token as client ID
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            try:
                # Wait for client message
                data = await websocket.receive_text()
                
                try:
                    msg = json.loads(data)
                    if "latitude" in msg and "longitude" in msg:
                        lat = float(msg["latitude"])
                        lon = float(msg["longitude"])
                        
                        # Validate coordinates
                        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                            await websocket.send_json({
                                'type': 'error',
                                'message': 'Invalid coordinates'
                            })
                            continue
                        
                        # Update air quality data
                        await manager.update_air_quality(client_id, lat, lon)
                        
                        # Schedule periodic updates
                        if manager.active_connections[client_id]['update_task']:
                            manager.active_connections[client_id]['update_task'].cancel()
                        
                        task = asyncio.create_task(periodic_update(client_id, lat, lon))
                        manager.active_connections[client_id]['update_task'] = task
                        
                except (json.JSONDecodeError, ValueError) as e:
                    await websocket.send_json({
                        'type': 'error',
                        'message': 'Invalid message format'
                    })
            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                await websocket.send_json({
                    'type': 'error',
                    'message': 'Internal server error'
                })
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(client_id)

async def periodic_update(client_id: str, lat: float, lon: float):
    """Periodically update air quality data for a client"""
    while True:
        try:
            await manager.update_air_quality(client_id, lat, lon)
            await asyncio.sleep(300)  # Update every 5 minutes
        except Exception as e:
            logger.error(f"Error in periodic update for client {client_id}: {str(e)}")
            await asyncio.sleep(5)  # Wait before retry
