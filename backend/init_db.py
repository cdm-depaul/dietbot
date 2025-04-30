from dietbot.database import init_db, engine
from sqlalchemy.exc import OperationalError
import time

def check_db_connection(max_retries=10, delay=5):
    retries = 0
    while retries < max_retries:
        try:
            # Try to establish a connection
            connection = engine.connect()
            connection.close()
            print("Database connection successful.")
            return True
        except OperationalError as e:
            retries += 1
            print(f"Database connection failed (attempt {retries}/{max_retries}): {e}")
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
    print("Max retries reached. Could not connect to the database.")
    return False

if __name__ == "__main__":
    print("Attempting to connect to the database...")
    if check_db_connection():
        init_db()
    else:
        print("Exiting due to database connection failure.")
        exit(1)
