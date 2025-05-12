from fastapi import APIRouter, HTTPException, status
from datetime import date

from .. import schemas
from ..supabase import supabase
from ..constants import RDI_VALUES

router = APIRouter(
    prefix="/nutrients",
    tags=["nutrients"],
)

@router.post("/{user_id}/intake", response_model=schemas.NutrientResponse, status_code=status.HTTP_201_CREATED)
def add_nutrient_intake(
    user_id: int,
    nutrient_data: schemas.NutrientCreate,
):
    user_response = supabase.table('user_profiles').select("user_id").eq('user_id', user_id).limit(1).execute()
    if not user_response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    today = date.today()
    
    intake_data = nutrient_data.model_dump()
    intake_data['user_id'] = user_id
    intake_data['entry_date'] = today.isoformat() #

    try:
        insert_response = supabase.table('food_intake').insert(intake_data).execute()
        if not insert_response.data:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add nutrient intake")

        created_intake = insert_response.data[0] # Get the first inserted record
        return schemas.NutrientResponse(**created_intake)

    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e}")

@router.get("/{user_id}/comparison", response_model=schemas.ComparisonResponse)
def get_nutrient_comparison(user_id: int):
    # Get user profile using Supabase
    user_response = supabase.table('user_profiles').select("user_id, sex, activity_level").eq('user_id', user_id).limit(1).execute()
    if not user_response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_user_data = user_response.data[0]
    user_sex = db_user_data.get('sex')
    user_activity_level = db_user_data.get('activity_level')

    if not user_sex or not user_activity_level:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User sex or activity level missing for RDI calculation")
    
    if user_sex not in RDI_VALUES or user_activity_level not in RDI_VALUES[user_sex]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"RDI values not found for sex '{user_sex}' and activity level '{user_activity_level}'")

    today = date.today()
    
    try:
        intake_response = supabase.table('food_intake')\
                                  .select("calories, protein, carbohydrates, fat, fiber, sugar")\
                                  .eq('user_id', user_id)\
                                  .eq('entry_date', today.isoformat())\
                                  .execute()

        if intake_response.data is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not fetch nutrient intake")

        # Aggregate nutrients
        nutrient_summary = {
            'calories': 0.0,
            'protein': 0.0,
            'carbohydrates': 0.0,
            'fat': 0.0,
            'fiber': 0.0,
            'sugar': 0.0
        }
        for record in intake_response.data:
            for nutrient, value in record.items():
                if nutrient in nutrient_summary and value is not None:
                    nutrient_summary[nutrient] += float(value)
    
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error fetching summary: {e}")

    user_rdi = RDI_VALUES[user_sex][user_activity_level]

    comparisons = []
    for nutrient, consumed in nutrient_summary.items():
        rdi_value = user_rdi.get(nutrient)
        if rdi_value is not None and rdi_value > 0: # Avoid division by zero and compare only available RDI values
            percentage = round((consumed / rdi_value) * 100, 2)
            comparisons.append(
                schemas.NutrientComparison(
                    nutrient=nutrient,
                    consumed=round(consumed, 2),
                    rdi=rdi_value,
                    percentage=percentage
                )
            )
        elif rdi_value is not None: # Handle cases where RDI is 0 or not strictly positive
             comparisons.append(
                schemas.NutrientComparison(
                    nutrient=nutrient,
                    consumed=round(consumed, 2),
                    rdi=rdi_value,
                    percentage=float('inf') if consumed > 0 else 0.0 # Or handle as appropriate
                )
            )

    return schemas.ComparisonResponse(comparisons=comparisons)
