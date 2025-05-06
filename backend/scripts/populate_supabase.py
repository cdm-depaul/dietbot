import os
import sys
from datetime import date
from dotenv import load_dotenv
from supabase import create_client, Client

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
load_dotenv(dotenv_path=os.path.join(project_root, '.env'))

def populate_db():
    """Connects to Supabase and inserts initial data."""
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_ANON_KEY") # Use the ANON key

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")
        return

    try:
        print(f"Connecting to Supabase at {supabase_url}...")
        supabase: Client = create_client(supabase_url, supabase_key)
        print("Supabase client created.")

        # Populate users table 
        user_id_to_insert = 1 # testing ID
        print(f"Attempting to insert/update user with ID: {user_id_to_insert}")
        
        user_data = {
            'id': user_id_to_insert,
            'name': 'Default User',
            'age': 30,
            'sex': 'Male', 
            'height': 175, # cm
            'weight': 70,  # kg
            'activity_level': 'Moderately active',
            'allergies': ['nuts', 'shellfish'],
            'likes': ['apples', 'chicken'],
            'dislikes': ['broccoli'],
            'diet': 'Balanced', 
            'goal': 'Maintain weight' 
        }
        
        response_user = supabase.table('user_profiles').upsert(user_data).execute()
        print("Upsert User response:", response_user)

        if response_user.data:
            print(f"Successfully inserted/updated user with ID {user_id_to_insert}.")
        elif hasattr(response_user, 'error') and response_user.error:
             # Print the full error object
             print(f"Error inserting/updating user {user_id_to_insert}: {response_user.error}")
        elif not response_user.data:
             # Catch cases where there's no data and no specific error attribute
             print(f"Potential issue inserting/updating user {user_id_to_insert}. Full response: {response_user}")

        # Populate nutrient_intake table
        print(f"Attempting to insert sample nutrient intake for user {user_id_to_insert}...")
        try:
            nutrient_data = [
                {
                    'user_id': user_id_to_insert, 
                    'date': str(date.today()),
                    'dish_name': 'Breakfast Burrito', 
                    'calories': 550, 
                    'protein': 25, 
                    'fat': 30, 
                    'carbs': 40, 
                    'fiber': 8, 
                    'sodium': 900
                },
                {
                    'user_id': user_id_to_insert, 
                    'date': str(date.today()),
                    'dish_name': 'Chicken Salad', 
                    'calories': 350, 
                    'protein': 30, 
                    'fat': 15, 
                    'carbs': 20, 
                    'fiber': 5, 
                    'sodium': 600
                }
            ]
            response_nutrient = supabase.table('nutrient_intake').insert(nutrient_data).execute()
            print(f"Inserted sample nutrient intake for user {user_id_to_insert}: {response_nutrient}")
            
            if hasattr(response_nutrient, 'error') and response_nutrient.error:
                print(f"Error inserting nutrient intake: {response_nutrient.error}")
            elif not response_nutrient.data:
                print(f"Potential issue inserting nutrient intake. Full response: {response_nutrient}")

        except Exception as e:
             print(f"Error inserting nutrient intake: {e}")


    except Exception as e:
        # Print the full exception details
        import traceback
        print(f"An error occurred during Supabase operation:")
        traceback.print_exc()

if __name__ == "__main__":
    print("--- Starting Supabase Population Script ---")
    populate_db()
    print("--- Supabase Population Script Finished ---")
