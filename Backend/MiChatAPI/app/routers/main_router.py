from fastapi import APIRouter
from app.routers.access_router import auth_router

main_router = APIRouter (
   prefix = "/v1"
)

main_router.include_router(auth_router)