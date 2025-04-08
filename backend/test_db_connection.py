from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.database import engine

def test_connection():
    try:
        # Test connection
        with engine.connect() as conn:
            print("Successfully connected to database!")
        
        # Test user table
        with Session(engine) as session:
            # Try to query users table
            users = session.query(User).all()
            print(f"Successfully queried users table. Found {len(users)} users.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()
