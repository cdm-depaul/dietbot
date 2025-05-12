from pydantic import BaseModel, Field, Json
from typing import List, Optional
from datetime import date

# User Profile
class UserBase(BaseModel):
    name: str
    age: int
    sex: str
    height: int
    weight: int
    activity_level: str
    allergies: List[str] = []
    likes: List[str] = []
    dislikes: List[str] = []
    diet: str
    goal: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    name: str
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Nutrient Intake
class NutrientBase(BaseModel):
    dish_name: str
    calories: Optional[float] = 0
    protein: Optional[float] = 0
    fat: Optional[float] = 0
    carbs: Optional[float] = 0
    fiber: Optional[float] = 0
    sodium: Optional[float] = 0

class NutrientCreate(NutrientBase):
    pass 

class NutrientResponse(NutrientBase):
    id: int
    user_id: int
    date: date

    class Config:
        from_attributes = True

# Chat
class ChatQuery(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

# User Context
class UserContextResponse(BaseModel):
    profile: UserResponse
    recent_intake: List[NutrientResponse]

    class Config:
        from_attributes = True

# RDI Comparison
class NutrientComparison(BaseModel):
    nutrient: str
    consumed: float
    rdi: float
    percentage: float

class ComparisonResponse(BaseModel):
    comparisons: List[NutrientComparison]

