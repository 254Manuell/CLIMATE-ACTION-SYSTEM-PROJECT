from app.core.database import engine
from app.core.config import settings
from sqlalchemy import text
import traceback

# Debug settings
print("Debug - Settings:")
print(f"USER: {settings.MYSQL_USER}")
print(f"HOST: {settings.MYSQL_HOST}")
print(f"PORT: {settings.MYSQL_PORT}")
print(f"DB: {settings.MYSQL_DATABASE}")

def test_connection():
    try:
        # Print the connection URL (without password)
        url = str(engine.url)
        print(f"Debug - Full URL: {url}")
        
        with engine.connect() as conn:
            result = conn.execute(text('SELECT VERSION()'))
            version = result.scalar()
            print('Database connection successful!')
            print(f'MySQL version: {version}')
            return True
    except Exception as e:
        print('Database connection failed!')
        print(f'Error type: {type(e).__name__}')
        print(f'Error message: {str(e)}')
        print('\nTraceback:')
        traceback.print_exc()
        return False

if __name__ == '__main__':
    test_connection()
