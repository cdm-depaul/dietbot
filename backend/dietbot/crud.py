from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from . import db_models, schemas

def get_user_by_name(db: Session, name: str):
    return db.query(models.UserProfile).filter(models.UserProfile.name == name).first()


# User Profile
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.UserProfile(
        name=user.name,
        password=user.password, # Hashing to be added here
        age=user.age,
        sex=user.sex,
        height=user.height,
        weight=user.weight,
        activity_level=user.activity_level,
        allergies=user.allergies,
        likes=user.likes,
        dislikes=user.dislikes,
        diet=user.diet,
        goal=user.goal
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_profile(db: Session, user_id: int):
    return db.query(models.UserProfile).filter(models.UserProfile.id == user_id).first()


# Daily Nutrient Intake 
def create_daily_nutrient_intake(db: Session, nutrient: schemas.NutrientCreate, user_id: int, entry_date: date):
    db_nutrient = models.DailyNutrientIntake(
        **nutrient.dict(), 
        user_id=user_id, 
        date=entry_date
    )
    db.add(db_nutrient)
    db.commit()
    db.refresh(db_nutrient)
    return db_nutrient

def get_daily_nutrient_intake(db: Session, user_id: int, entry_date: date):
    return db.query(models.DailyNutrientIntake)\
             .filter(models.DailyNutrientIntake.user_id == user_id, 
                     models.DailyNutrientIntake.date == entry_date)\
             .all()

def get_recent_nutrient_intake(db: Session, user_id: int, limit: int = 5):
    """Gets the most recent nutrient intake entries for a user."""
    return db.query(models.DailyNutrientIntake)\
             .filter(models.DailyNutrientIntake.user_id == user_id)\
             .order_by(models.DailyNutrientIntake.date.desc(), models.DailyNutrientIntake.id.desc())\
             .limit(limit)\
             .all()

def get_nutrient_summary_for_date(db: Session, user_id: int, entry_date: date):
    """Calculates the sum of nutrients for a specific user and date."""
    summary = db.query(
        func.sum(models.DailyNutrientIntake.calories).label('total_calories'),
        func.sum(models.DailyNutrientIntake.protein).label('total_protein'),
        func.sum(models.DailyNutrientIntake.fat).label('total_fat'),
        func.sum(models.DailyNutrientIntake.carbs).label('total_carbs'),
        func.sum(models.DailyNutrientIntake.fiber).label('total_fiber'),
        func.sum(models.DailyNutrientIntake.sodium).label('total_sodium')
    ).filter(
        models.DailyNutrientIntake.user_id == user_id,
        models.DailyNutrientIntake.date == entry_date
    ).first()
    
    # Convert None sums to 0.0
    return {
        'calories': summary.total_calories or 0.0,
        'protein': summary.total_protein or 0.0,
        'fat': summary.total_fat or 0.0,
        'carbs': summary.total_carbs or 0.0,
        'fiber': summary.total_fiber or 0.0,
        'sodium': summary.total_sodium or 0.0
    }
