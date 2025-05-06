from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from .. import crud, schemas
from ..database import get_db
from ..constants import RDI_VALUES

router = APIRouter(
    prefix="/nutrients",
    tags=["nutrients"],
)

@router.post("/{user_id}/intake", response_model=schemas.NutrientResponse, status_code=status.HTTP_201_CREATED)
def add_nutrient_intake(
    user_id: int,
    nutrient_data: schemas.NutrientCreate,
    db: Session = Depends(get_db)
):
    # Check if user exists
    db_user = crud.get_user_profile(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    today = date.today()
    created_intake = crud.create_daily_nutrient_intake(
        db=db, 
        nutrient=nutrient_data, 
        user_id=user_id, 
        entry_date=today
    )
    return created_intake

@router.get("/{user_id}/comparison", response_model=schemas.ComparisonResponse)
def get_nutrient_comparison(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_profile(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Check if user profile details needed for RDI are present
    if not db_user.sex or not db_user.activity_level:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User sex or activity level missing for RDI calculation")
    
    # Check if RDI values exist for the user's profile
    if db_user.sex not in RDI_VALUES or db_user.activity_level not in RDI_VALUES[db_user.sex]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"RDI values not found for sex '{db_user.sex}' and activity level '{db_user.activity_level}'")

    today = date.today()
    nutrient_summary = crud.get_nutrient_summary_for_date(db, user_id=user_id, entry_date=today)
    user_rdi = RDI_VALUES[db_user.sex][db_user.activity_level]

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
