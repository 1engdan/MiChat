from app.cfg.settings import settings
from app.database import database
from app.schemas.account import users
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import models
import bcrypt
from sqlalchemy import (
select,
update,
delete,
insert
)

def create_db():
  return database.Base.metadata.create_all(bind=database.get_engine())

async def get_db():
    async with database.get_session() as session:
        yield session

async def get_user_by_email(email: str, session: AsyncSession):
  result = await session.execute(select(models.User).where(models.User.email == email))
  return result.scalar_one_or_none()

async def get_user_by_username(username: str, session: AsyncSession):
  result = await session.execute(select(models.User).where(models.User.username == username))
  return result.scalar_one_or_none()

async def create_user(user: users.UserCreate, session: AsyncSession):
  hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
  user_obj = models.User(email=user.email, username=user.username, password=hashed_password.decode('utf-8'))
  session.add(user_obj)
  session.commit()
  session.refresh(user_obj)
  return user_obj
