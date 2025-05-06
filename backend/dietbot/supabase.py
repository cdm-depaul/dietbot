import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")

# Check if the environment variables are loaded
if not url or not key:
    raise ValueError("Supabase URL or Key not found in environment variables.")

# Initialize the Supabase client
supabase: Client = create_client(url, key)
