from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[BlogPostResponse])
def read_blog_posts(db: Session = Depends(get_db)):
    """
    Retrieve all blog posts.
    """
    return db.query(BlogPost).all()

@router.post("/", response_model=BlogPostResponse)
def create_blog_post(
    *,
    db: Session = Depends(get_db),
    post_in: BlogPostCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new blog post.
    """
    post = BlogPost(
        title=post_in.title,
        content=post_in.content,
        author_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.get("/{post_id}", response_model=BlogPostResponse)
def read_blog_post(post_id: int, db: Session = Depends(get_db)):
    """
    Get a specific blog post by ID.
    """
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return post

@router.delete("/{post_id}")
def delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a blog post.
    """
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    if post.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted"}
