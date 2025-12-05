from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    sport: str
    frequency: str
    level: str
    goals: List[str]
    constraints: List[str]
    budget: str
    medical_conditions: Optional[str] = None
    posture_rating: Optional[int] = None
    back_pain: Optional[str] = None
    sedentary_level: Optional[str] = None

class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_url: str
    url: str
    score: float

class RecommendationResponse(BaseModel):
    advice: str
    external_advice: str
    products: List[Product]
