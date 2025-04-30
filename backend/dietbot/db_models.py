from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class UserProfile(Base):
    __tablename__ = "user_profile"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(String(100), nullable=False) 
    age = Column(Integer, nullable=False)
    sex = Column(String(10), nullable=False)
    height = Column(Integer, nullable=False)
    weight = Column(Integer, nullable=False)
    activity_level = Column(String(50), nullable=False)
    allergies = Column(JSON, default=[]) 
    likes = Column(JSON, nullable=False, default=[]) 
    dislikes = Column(JSON, nullable=False, default=[])
    diet = Column(String(50), nullable=False)
    goal = Column(String(50), nullable=False)
    daily_nutrient_intake = relationship('DailyNutrientIntake', back_populates='user', lazy='selectin') 

class DailyNutrientIntake(Base):
    __tablename__ = "daily_nutrient_intake"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user_profile.id'), nullable=False)
    date = Column(Date, nullable=False, index=True)
    dish_name = Column(String(100), nullable=False)
    calories = Column(Float, default=0)
    protein = Column(Float, default=0)
    fat = Column(Float, default=0)
    carbs = Column(Float, default=0)
    fiber = Column(Float, default=0)
    sodium = Column(Float, default=0)

    user = relationship('UserProfile', back_populates='daily_nutrient_intake')
