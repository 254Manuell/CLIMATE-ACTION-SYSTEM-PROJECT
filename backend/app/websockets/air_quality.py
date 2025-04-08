from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Optional
from datetime import datetime
import json
import asyncio
from app.services.air_quality_service import AirQualityService

class AirQualityWebSocket:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.air_quality_service = AirQualityService()
        self.background_task = None

    async def connect(self, websocket: WebSocket, location_key: str):
        await websocket.accept()
        if location_key not in self.active_connections:
            self.active_connections[location_key] = []
        self.active_connections[location_key].append(websocket)
        
        # Start background task if not running
        if not self.background_task:
            self.background_task = asyncio.create_task(self.update_air_quality())

    def disconnect(self, websocket: WebSocket, location_key: str):
        self.active_connections[location_key].remove(websocket)
        if not self.active_connections[location_key]:
            del self.active_connections[location_key]
        
        # Stop background task if no connections
        if not self.active_connections and self.background_task:
            self.background_task.cancel()
            self.background_task = None

    async def broadcast_to_location(self, location_key: str, data: dict):
        if location_key in self.active_connections:
            dead_connections = []
            for connection in self.active_connections[location_key]:
                try:
                    await connection.send_json(data)
                except WebSocketDisconnect:
                    dead_connections.append(connection)
            
            # Clean up dead connections
            for dead in dead_connections:
                self.active_connections[location_key].remove(dead)
            if not self.active_connections[location_key]:
                del self.active_connections[location_key]

    async def update_air_quality(self):
        """Background task to periodically update air quality data"""
        while True:
            try:
                for location_key in list(self.active_connections.keys()):
                    lat, lon = map(float, location_key.split(','))
                    data = await self.air_quality_service.get_air_quality_data(lat, lon)
                    if data:
                        await self.broadcast_to_location(location_key, {
                            'timestamp': datetime.utcnow().isoformat(),
                            'data': data
                        })
                await asyncio.sleep(300)  # Update every 5 minutes
            except Exception as e:
                print(f"Error in air quality update: {e}")
                await asyncio.sleep(60)  # Wait a minute before retrying

air_quality_ws = AirQualityWebSocket()
