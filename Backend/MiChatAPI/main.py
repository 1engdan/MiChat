from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.account import users, profile
from app.services import user_services
from app.cfg.settings import settings
from app.services import user_services


api = FastAPI(
    title="MiChatAPI",
    description="The API docs for MiChat.",
    version="v1",
)

api.add_middleware (
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@api.post("/")
async def main():
  return {"msg": "work"}

@api.post("/api/users")
async def create_user(user: users.UserCreate, session: AsyncSession = Depends(user_services.get_db)):
    db_user = await user_services.get_user_by_email(user.email, session)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    return await user_services.create_user(user, session)