from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine, 
    AsyncEngine
)

from sqlalchemy.orm import sessionmaker, declarative_base


from contextlib import asynccontextmanager
from ..cfg.settings import settings

Base = declarative_base()

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

async def get_engine():
    return create_async_engine(settings.db_url, echo=True, future=True)

# @asynccontextmanager
async def get_session():
    async_session = sessionmaker(await get_engine(), expire_on_commit=False, class_=AsyncSession)
    async with async_session() as session:
        yield session

async def create_tables():
    try:
        engine = await get_engine()
        async with engine.begin() as eng:
            await eng.run_sync(Base.metadata.create_all)
    except Exception as e:
        print("Не удалось создать таблицы. ", str(e))