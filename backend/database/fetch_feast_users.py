from services.feast_service import feast_service
import asyncio
import random
import string
from datetime import date
import pandas as pd
from sqlalchemy.future import select

from database.db import get_db
from database.models_sql import User
from services.security import hash_password

# Utility: generate random email and password
def generate_email(user_id: str) -> str:
    return f"user_{user_id[-6:]}@example.com"

def generate_password(length=10) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

async def seed_users():
    users: pd.DataFrame = feast_service.get_all_existing_users()

    # Filter out new users (27-digit numeric strings)
    users = users[~(users["user_id"].astype(str).str.isdigit() & (users["user_id"].astype(str).str.len() == 27))]

    async for db in get_db():
        # Get existing user IDs from database
        result = await db.execute(select(User.user_id))
        existing_user_ids = {row[0] for row in result.fetchall()}
        
        # Filter out users that already exist in database
        users_to_add = users[~users["user_id"].astype(str).isin(existing_user_ids)]
        
        # Generate emails and passwords for all users at once
        users_to_add["email"] = users_to_add["user_id"].astype(str).apply(generate_email)
        users_to_add["password"] = users_to_add["user_id"].apply(lambda _: generate_password())
        
        # Create User objects in batch
        user_objects = users_to_add.assign(
            user_id=lambda df: df['user_id'].astype(str),
            age=0,
            gender='unknown',
            signup_date=date.today(),
            preferences=lambda df: df['preferences'].fillna(''),
            hashed_password=lambda df: df['password'].apply(hash_password)
        ).apply(
            lambda row: User(
                user_id=row['user_id'],
                email=row['email'],
                age=row['age'],
                gender=row['gender'],
                signup_date=row['signup_date'],
                preferences=row['preferences'],
                password=row['password'],
                hashed_password=row['hashed_password']
            ),
            axis=1
        ).tolist()
        
        # Add all users at once
        db.add_all(user_objects)
        await db.commit()

if __name__ == "__main__":
    asyncio.run(seed_users())
