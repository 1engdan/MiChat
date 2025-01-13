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

@account_router.put("/update")
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

    return {"message": "Аккаунт и профиль успешно удалены"}

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

@account_router.get("/{username}")
async def get_profile(username: str, session: AsyncSession = Depends(get_session)):
    # Получаем пользователя по username
    user_query = select(User).where(User.username == username)
    user_result = await session.execute(user_query)
    user = user_result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Получаем профиль пользователя
    profile_query = select(Profile).where(Profile.iduser == user.userId)
    profile_result = await session.execute(profile_query)
    profile = profile_result.scalars().first()

    # Возвращаем данные профиля
    profile_data = {
        "username": user.username,
        "name": profile.name,
        "about_me": profile.about_me,
        "birthday": profile.birthday
    }

    # Если есть изображение, возвращаем его
    if profile.image:
        return JSONResponse(content={"profile": profile_data, "image_url": f"/v1/profile/{username}/image"})

    return JSONResponse(content={"profile": profile_data})

@account_router.get("/{username}/image")
async def get_image(username: str, session: AsyncSession = Depends(get_session)):
    # Получаем пользователя по username
    user_query = select(User).where(User.username == username)
    user_result = await session.execute(user_query)
    user = user_result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Получаем профиль пользователя
    profile_query = select(Profile).where(Profile.iduser == user.userId)
    profile_result = await session.execute(profile_query)
    profile = profile_result.scalars().first()

    if profile is None or profile.image is None:
        raise HTTPException(status_code=404, detail="Изображение не найдено")

    return StreamingResponse(io.BytesIO(profile.image), media_type="image/jpeg")