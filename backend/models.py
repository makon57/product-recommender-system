from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

class InteractionType(Enum):
    POSITIVE_VIEW = 'positive_view'
    NEGATIVE_VIEW = 'negative_view'
    CART = 'cart'
    PURCHASE = 'purchase'
    RATE = 'rate'

class Product(BaseModel):
    item_id: int
    name: str
    category: str
    subcategory: str
    price: float
    avg_rating: float
    num_ratings: int
    popular: float
    new_arrival: float
    on_sale: float
    arrival_date: date
    description: str

class User(BaseModel):
    user_id: str  
    email: str
    age: int
    gender: str
    signup_date: date
    preferences: str
    views: Optional[List[Product]] = None

class Feedback(BaseModel):
    userId: str  
    productId: int
    rating: float
    title: Optional[str] = ''
    comment: Optional[str] = ''

class LoginRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    email: str
    password: str
    age: int
    gender: str

class AuthResponse(BaseModel):
    user: User
    token: str

class CartItem(BaseModel):
    user_id: str  
    product_id: int
    quantity: int

class CheckoutRequest(BaseModel):
    user_id: str  
    items: List[CartItem]
    shipping_address: str
    payment_method: str

class Order(BaseModel):
    order_id: int
    user_id: str  
    items: List[CartItem]
    total_amount: float
    order_date: datetime
    status: str

class WishlistItem(BaseModel):
    user_id: str  
    product_id: int
