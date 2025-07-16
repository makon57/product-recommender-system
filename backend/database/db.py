from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

def get_engine():
    engine = create_async_engine(os.getenv('DATABASE_URL', None).replace("postgresql://", "postgresql+asyncpg://"), echo=True)
    return engine

# Async SQLAlchemy engine
def get_session_maker():
    engine = get_engine()
    # Async session
    asyncSessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    return asyncSessionLocal


async def get_db():
    asyncSessionLocal = get_session_maker()
    session = asyncSessionLocal()
    try:
        yield session
    finally:
        await session.close()

