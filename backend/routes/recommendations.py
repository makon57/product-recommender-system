from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from pydantic import BaseModel

from models import Product
from database.models_sql import User
from services.feast_service import FeastService
from routes.auth import get_current_user  # to resolve JWT user

router = APIRouter()


# GET for existing users
@router.get("/recommendations/{user_id}", response_model=List[Product])
def get_recommendations(user_id: str):
    try:
        return FeastService().load_items_existing_user(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Input model for new user recommendations
class NewUserRecommendationRequest(BaseModel):
    num_recommendations: int = 10


# POST for new users (authenticated)
@router.post("/recommendations", response_model=List[Product])
async def recommend_for_new_user(
    payload: NewUserRecommendationRequest,
    user: User = Depends(get_current_user)
):
    try:
        return FeastService().load_items_new_user(user, k=payload.num_recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
