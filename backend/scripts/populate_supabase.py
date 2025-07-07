import os
import sys
from datetime import date
from dotenv import load_dotenv
from supabase import create_client, Client

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

## 7/1/2025 nt:
dotenv_path=os.path.join(project_root, '.env')
print (dotenv_path)
load_dotenv(dotenv_path)
##

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
            #'id': user_id_to_insert, 
            'user_id': user_id_to_insert,    ## 7/3/2025 nt: changed
            'created_at': str(date.today()), ## 7/1/2025 nt: added
            'name': 'Jack',
            'age': 50,
            'sex': 'Male', 
            'height': 175, # cm
            'weight': 70,  # kg
            'activity_level': 'Moderately active',
            'allergies': ['nuts', 'shellfish'],
            'likes': ['apples', 'chicken'],
            'dislikes': ['broccoli'],
            'diet': 'Balanced', 
            #'goal': 'Maintain weight'
            'goal': 'Prevent diabetes' #'Maintain weight' ## 7/1/2025 nt: changed
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
            id_count = 0
            #nutrient_data = [
            #    {
            nutrient_data = {
                    'id' : id_count + 1,  ## 7/1/2025 nt: added
                    'user_id': user_id_to_insert, 
                    'created_at': date.today().isoformat(),  # Use ISO format for dates str(date.today()),  ## 7/1/2025 nt: changed
                    #'dish_name': 'Breakfast Burrito', ## 7/1/2025 nt: changed
                    'food_item': 'Breakfast Burrito', 
                    'calories': 550, 
                    'protein_g': 25.0, ## 7/1/2025 nt: changed
                    'fat_g': 30.0, ## 7/1/2025 nt: changed
                    ## 7/1/2025 nt: changed
                    #'details': {"fiber": 8, "sodium": 900},#::jsonb,
                    'carbs_g': 40.0
            }#,
                #{
                #    'id' : id_count + 2,  ## 7/1/2025 nt: added
                #    'user_id': user_id_to_insert, 
                #    'created_at': str(date.today()),  ## 7/1/2025 nt: changed from 'date': str(date.today())
                #    'food_item':'Chicken Salad',  ## 7/1/2025 nt: changed
                #    'calories': 350, 
                #    'protein_g': 30, 
                #    'fat_g': 15, 
                #    ## 7/1/2025 nt: changed
                #    #'details': {"fiber": 5, "sodium": 600},#::jsonb
                #    'carbs_g': 20
                #}
            #]
            print()
            print (nutrient_data)
            print ()
            
            print(f"Inserting sample nutrient intake for user {user_id_to_insert}: {nutrient_data}")
            response_nutrient = supabase.table('nutrient_intake').insert(nutrient_data).execute()
            print(f"Inserted sample nutrient intake for user {user_id_to_insert}: {response_nutrient}")
            ## 7/2/2025 nt:
            #for idx, data in enumerate(nutrient_data):
            #	print(f"({idx}) Inserting sample nutrient intake for user {user_id}: {response_nutrient}")
            #	response_nutrient = supabase.table('nutrient_intake').insert(data).execute()
            	
            
            ###-------------------
	    # Query data from the table
            response = supabase.table('nutrient_intake').select('*').execute()
            data = response.data
	    
	    
	    # Print the data
            for row in data:
              print(row)
	    ###--------------------


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
