import mysql.connector

def test_connection():
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Bb@8920360500",
            database="climate_action_db"
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print("Database connection successful!")
            print("MySQL version:", version[0])
            cursor.close()
            connection.close()
            return True
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
