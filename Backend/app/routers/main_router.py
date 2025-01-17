from fastapi import APIRouter
from app.routers.access_router import auth_router
from app.routers.account_router import account_router
from app.routers.setting_router import setting_router

main_router = APIRouter ()

main_router.include_router(auth_router)
main_router.include_router(account_router)
main_router.include_router(setting_router)