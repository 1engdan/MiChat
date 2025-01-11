from fastapi import FastAPI

from app.routers.main_router import main_router

from starlette.middleware.cors import CORSMiddleware

from typing import Annotated
from sqlalchemy.orm import Session
from alembic.config import Config
from alembic import command

api = FastAPI(
    title="MiChatAPI",
    description="The API docs for MiChat.",
    version="v1",
)

origins = [
    "http://localhost:5173",
    "http://localhost:8000",
]

api.add_middleware (
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

api.include_router(main_router)

@api.post("/")
async def main():
  return {"msg": "work"}