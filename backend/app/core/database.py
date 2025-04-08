from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

from urllib.parse import quote_plus

password = quote_plus(settings.MYSQL_PASSWORD)
DATABASE_URL = f"mysql+pymysql://root:{password}@localhost:{settings.MYSQL_PORT}/{settings.MYSQL_DATABASE}"
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
