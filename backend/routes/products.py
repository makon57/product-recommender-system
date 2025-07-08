from fastapi import APIRouter, HTTPException
from typing import List
from models import Product
from services.kafka_service import kafka_service

router = APIRouter()

@router.get("/products/search", response_model=List[Product])
async def search_products_by_text(query: str):
    """
    Search products by text query
    """
    # Logic for text-based search
    return []

@router.get("/products/search/image", response_model=List[Product])
async def search_products_by_image(image):
    """
    Search products by image
    """
    # Logic for image-based search
    # You would typically process the image file here (e.g., save it, send to an ML model)
    return []

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int, user_id: str):
    """
    Get product details by ID
    """
    # Send view interaction to Kafka
    kafka_service.send_interaction(
        user_id=user_id,
        item_id=product_id,
        interaction_type='negative_view'
    )
    
    # TODO: read from DB
    raise HTTPException(status_code=501, detail="Not implemented")

@router.post("/products/{product_id}/interactions/click", status_code=204)
async def record_product_click(product_id: int, user_id: str):
    """
    Records a product click interaction event
    """
    kafka_service.send_interaction(
        user_id=user_id,
        item_id=product_id,
        interaction_type='positive_view'
    )
    return
