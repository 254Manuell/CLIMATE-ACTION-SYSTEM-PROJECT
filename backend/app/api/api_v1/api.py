from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, blog, relay

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(relay.router, prefix="/relay", tags=["relay"])
