from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import random, string
from datetime import date
from models import SignUpRequest, LoginRequest, AuthResponse, User as UserResponse
from database.models_sql import User
from database.db import get_db
from services.kafka_service import KafkaService  # Kafka send
from services.security import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)

# OAuth2 scheme for Bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Utility: generate a 27-digit user ID
def generate_user_id() -> str:
    return ''.join(random.choices(string.digits, k=27))

# Dependency: get current user from JWT
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception
        user_id = str(sub)
    except (JWTError, ValueError):
        raise credentials_exception
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise credentials_exception
    return user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    payload: SignUpRequest,
    db: AsyncSession = Depends(get_db),
):
    # Prevent duplicates
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")

    # Create user with generated ID
    new_id = generate_user_id()
    user = User(
        user_id=new_id,
        email=payload.email,
        age=payload.age,
        gender=payload.gender,
        signup_date=date.today(),
        preferences="",
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Send Kafka new-user event
    KafkaService().send_new_user(
        user_id=user.user_id,
        user_name=user.email,
        preferences=user.preferences,
    )

    # Issue JWT
    token = create_access_token(subject=str(user.user_id))

    user_response = UserResponse(
        user_id=user.user_id,
        email=user.email,
        age=user.age,
        gender=user.gender,
        signup_date=user.signup_date,
        preferences=user.preferences,
        views=[],
    )
    return AuthResponse(user=user_response, token=token)


@router.post(
    "/login",
    response_model=AuthResponse,
)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    # Check credentials
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=str(user.user_id))

    user_response = UserResponse(
        user_id=user.user_id,
        email=user.email,
        age=user.age,
        gender=user.gender,
        signup_date=user.signup_date,
        preferences=user.preferences,
        views=[],
    )
    return AuthResponse(user=user_response, token=token)
