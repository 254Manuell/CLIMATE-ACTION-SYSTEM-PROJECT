from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BlogPostBase(BaseModel):
    title: str
    content: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
