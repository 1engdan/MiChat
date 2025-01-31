from datetime import date
import io
import logging
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.models import Profile, User
from app.security.jwtmanager import get_current_user, oauth2_scheme

from app.services.profile_services import ProfileService
from app.services.user_services import UserService

from app.database.database import get_session

from app.schemas.account.profile import UpdateProfile, ProfileImage

account_router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@account_router.get("/{username}")
async def get_profile(username: str, session: AsyncSession = Depends(get_session)):
    result = await ProfileService(session).get_profile_by_username(username)

    if not result.success:
        raise HTTPException(status_code=404, detail=result.error)

    profile = result.value

    result1 = await UserService(session).get_by_username(username)

    if not result1.success:
        raise HTTPException(status_code=404, detail=result1.error)

    user = result1.value

    profile_data = {
        "userId": str(user.userId),  # Преобразование UUID в строку
        "username": username,
        "name": profile.name,
        "about_me": profile.about_me,
        "birthday": profile.birthday.isoformat() if profile.birthday else None
    }

    if profile.image:
        return JSONResponse(content={"profile": profile_data, "image_url": True})

    return JSONResponse(content={"profile": profile_data})

@account_router.get("/{username}/image")
async def get_image(username: str, session: AsyncSession = Depends(get_session)):
    result = await ProfileService(session).get_image_by_username(username)

    if not result.success:
        raise HTTPException(status_code=404, detail=result.error)

    image = result.value
    return StreamingResponse(io.BytesIO(image), media_type="image/jpeg")