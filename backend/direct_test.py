from sqlalchemy import create_engine, text

# Database connection settings
DB_USER = "root"
DB_PASSWORD = "Bb@8920360500"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "climate_action_db"

# Create database URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

def test_connection():
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Database connection successful!")
            print("Connected to MySQL version:", connection.execute(text("SELECT VERSION()")).scalar())
            return True
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
