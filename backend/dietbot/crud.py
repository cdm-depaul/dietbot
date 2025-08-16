from datetime import date
from typing import List, Dict, Optional, Any   # ← add Any

from . import schemas 
from .supabase import supabase

# User Profile
def get_user_by_name(name: str) -> Optional[dict]:
    try:
        response = supabase.table('user_profiles').select("*", count='exact').eq('name', name).limit(1).execute()
        if response.count > 0 and response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching user by name '{name}': {e}")
        return None

def create_user(user: schemas.UserCreate) -> Optional[dict]:
    user_data = user.dict()
    try:
        response = supabase.table('user_profiles').insert(user_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error creating user '{user.name}': {e}") 
        return None

def get_user_profile(user_id: int) -> Optional[dict]:
    try:
        # If your PK is user_id, keep this. If it's id, change to .eq('id', user_id)
        response = supabase.table('user_profiles').select("*", count='exact').eq('user_id', user_id).limit(1).execute()
        if response.count > 0 and response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching user profile for ID '{user_id}': {e}")
        return None

# Daily Nutrient Intake
def create_daily_nutrient_intake(nutrient: schemas.NutrientCreate, user_id: int, entry_date: date) -> Optional[dict]:
    nutrient_data = nutrient.dict()
    nutrient_data['user_id'] = user_id
    nutrient_data['date'] = entry_date.isoformat()
    try:
        response = supabase.table('daily_nutrient_intake').insert(nutrient_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error creating nutrient intake for user '{user_id}' on {entry_date}: {e}") 
        return None

def get_daily_nutrient_intake(user_id: int, entry_date: date) -> List[dict]:
    try:
        response = supabase.table('daily_nutrient_intake').select("*")\
                         .eq('user_id', user_id)\
                         .eq('date', entry_date.isoformat())\
                         .execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching nutrient intake for user '{user_id}' on {entry_date}: {e}") 
        return []

def get_recent_nutrient_intake(user_id: int, limit: int = 5) -> List[dict]:
    try:
        response = supabase.table('daily_nutrient_intake').select("*")\
                         .eq('user_id', user_id)\
                         .order('date', desc=True)\
                         .order('id', desc=True)\
                         .limit(limit)\
                         .execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching recent nutrient intake for user '{user_id}': {e}") 
        return []

def get_nutrient_summary_for_date(user_id: int, entry_date: date) -> Dict[str, float]:
    summary = {'calories': 0.0, 'protein': 0.0, 'fat': 0.0, 'carbs': 0.0, 'fiber': 0.0, 'sodium': 0.0}
    try:
        response = supabase.table('daily_nutrient_intake')\
                         .select('calories, protein, fat, carbs, fiber, sodium')\
                         .eq('user_id', user_id)\
                         .eq('date', entry_date.isoformat())\
                         .execute()
        if response.data:
            for intake in response.data:
                summary['calories'] += intake.get('calories', 0.0) or 0.0
                summary['protein'] += intake.get('protein', 0.0) or 0.0
                summary['fat'] += intake.get('fat', 0.0) or 0.0
                summary['carbs'] += intake.get('carbs', 0.0) or 0.0
                summary['fiber'] += intake.get('fiber', 0.0) or 0.0
                summary['sodium'] += intake.get('sodium', 0.0) or 0.0
        return summary
    except Exception as e:
        print(f"Error summarizing nutrients for user '{user_id}' on {entry_date}: {e}") 
        return summary

# --- Chat history (short-term memory) ---

def get_recent_chat_history(user_id: int, limit: int = 12) -> List[Dict[str, Any]]:
    try:
        response = (
            supabase.table("chat_history")
            .select("sender, message, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []
    except Exception as e:
        print(f"Error fetching chat history for user '{user_id}': {e}")
        return []

def insert_chat_message(user_id: int, sender: str, message: str) -> Optional[dict]:
    try:
        response = (
            supabase.table("chat_history")
            .insert({"user_id": user_id, "sender": sender, "message": message})
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error inserting chat message for user '{user_id}': {e}")
        return None

def get_chat_history(user_id: int, limit: int = 20) -> List[dict]:
    try:
        res = (
            supabase.table("chat_history")
            .select("sender, message, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as e:
        print(f"Error fetching chat history for user '{user_id}': {e}")
        return []

def append_chat_turn(user_id: int, sender: str, message: str) -> Optional[dict]:
    try:
        res = (
            supabase.table("chat_history")
            .insert({"user_id": user_id, "sender": sender, "message": message})
            .execute()
        )
        return res.data[0] if res.data else None
    except Exception as e:
        print(f"Error appending chat turn for user '{user_id}': {e}")
        return None