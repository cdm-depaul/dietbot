from fastapi import APIRouter, HTTPException, status
from typing import List
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
    user_response = supabase.table('user_profiles').select('user_id').eq('user_id', user_id).limit(1).execute()
    if not user_response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    today = date.today()
    
    try:
        insert_response = supabase.table('daily_nutrient_intake').insert({
            'user_id': user_id,
            'nutrient_name': nutrient_data.nutrient_name,
            'amount': nutrient_data.amount,
            'unit': nutrient_data.unit,
            'entry_date': today.isoformat()
        }).execute()
        
        if insert_response.data and len(insert_response.data) > 0:
             created_intake_data = insert_response.data[0]
             return created_intake_data 
        else:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add nutrient intake")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e}")

@router.get("/{user_id}/comparison", response_model=schemas.ComparisonResponse)
def get_nutrient_comparison(user_id: int):
    user_profile_response = supabase.table('user_profiles').select('sex, activity_level').eq('user_id', user_id).limit(1).execute()

    if not user_profile_response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_user = user_profile_response.data[0] 
    user_sex = db_user.get('sex')
    user_activity_level = db_user.get('activity_level')

    if not user_sex or not user_activity_level:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User sex or activity level missing for RDI calculation")
    
    if user_sex not in RDI_VALUES or user_activity_level not in RDI_VALUES[user_sex]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"RDI values not found for sex '{user_sex}' and activity level '{user_activity_level}'")

    today = date.today()
    
    intake_response = supabase.table('daily_nutrient_intake').select('nutrient_name, amount')\
                          .eq('user_id', user_id)\
                          .eq('entry_date', today.isoformat())\
                          .execute()

    if intake_response.error:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error fetching intakes: {intake_response.error.message}")

    nutrient_summary = {}
    for intake in intake_response.data:
        nutrient = intake.get('nutrient_name')
        amount = intake.get('amount', 0) 
        if nutrient:
            nutrient_summary[nutrient] = nutrient_summary.get(nutrient, 0) + amount

    user_rdi = RDI_VALUES[user_sex][user_activity_level]

    comparisons = []
    for nutrient, consumed in nutrient_summary.items():
        rdi_value = user_rdi.get(nutrient)
        if rdi_value is not None and rdi_value > 0: 
            percentage = round((consumed / rdi_value) * 100, 2)
            comparisons.append(
                schemas.NutrientComparison(
                    nutrient=nutrient,
                    consumed=round(consumed, 2),
                    rdi=rdi_value,
                    percentage=percentage
                )
            )
        elif rdi_value is not None: 
             comparisons.append(
                schemas.NutrientComparison(
                    nutrient=nutrient,
                    consumed=round(consumed, 2),
                    rdi=rdi_value,
                    percentage=float('inf') if consumed > 0 else 0.0
                )
            )

    return schemas.ComparisonResponse(comparisons=comparisons)
