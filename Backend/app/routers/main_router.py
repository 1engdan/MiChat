from fastapi import APIRouter
from app.routers.access_router import auth_router
from app.routers.account_router import account_router

main_router = APIRouter (
   prefix = "/v1"
)

main_router.include_router(auth_router)
main_router.include_router(account_router)