from fastapi import APIRouter, HTTPException
from app.models.profile import UserProfile, RecommendationResponse
from app.services.recommendation import recommendation_service

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(profile: UserProfile):
    try:
        return recommendation_service.get_recommendations(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
