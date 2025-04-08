from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, blog, relay, websocket, air_quality

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(relay.router, prefix="/relay", tags=["relay"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
api_router.include_router(air_quality.router, prefix="/air-quality", tags=["air-quality"])
