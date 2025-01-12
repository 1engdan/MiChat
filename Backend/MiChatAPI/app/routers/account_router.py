import io
import logging
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.models import Profile, User
from app.security.jwtmanager import get_current_user, oauth2_scheme

from app.services.profile_services import ProfileService
from app.services.user_services import UserService

from app.database.database import get_session

from app.schemas.account.profile import UpdateProfile, ProfileImage

account_router = APIRouter(
    prefix="/account",
    tags=["Account"]
)

@account_router.put("/updateprofile")
async def update_profile(updateRequest: UpdateProfile, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    logging.info(f"Received update request: {updateRequest}")
    result = await ProfileService(session).update_profile(user.userId, updateRequest)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    # Возвращаем только текстовые данные профиля
    return {
        "iduser": result.value.iduser,
        "name": result.value.name,
        "about_me": result.value.about_me,
        "birthday": result.value.birthday
    }

@account_router.delete("/delete")
async def delete_account(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await UserService(session).delete_user(user.userId)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return result.value

@account_router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...), user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    contents = await file.read()
    image_request = ProfileImage(image=contents)
    result = await ProfileService(session).update_image(user.userId, image_request)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"message": "Изображение успешно загружено"}

@account_router.get("/get-image/{user_id}")
async def get_image(user_id: str, session: AsyncSession = Depends(get_session)):
    query = select(Profile).where(Profile.iduser == user_id)
    result = await session.execute(query)
    profile = result.scalars().first()

    if profile is None or profile.image is None:
        raise HTTPException(status_code=404, detail="Изображение не найдено")

    return StreamingResponse(io.BytesIO(profile.image), media_type="image/jpeg")
