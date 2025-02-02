import io
import logging
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.updaterequest.UpdateEmailRequest import UpdateEmailRequest
from app.schemas.updaterequest.UpdatePasswordRequest import UpdatePasswordRequest
from app.schemas.updaterequest.UpdateUsernameRequest import UpdateUsernameRequest

from app.database.models.models import Profile, User
from app.security.jwtmanager import get_current_user, oauth2_scheme

from app.services.profile_services import ProfileService
from app.services.user_services import UserService

from app.database.database import get_session

from app.schemas.account.profile import UpdateProfile, ProfileImage

setting_router = APIRouter(
    prefix="/setting",
    tags=["Setting"]
)

@setting_router.put("/profile/update")
async def update_profile(request: UpdateProfile, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ProfileService(session).update_profile(user.userId, request)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"msg": "Profile успешно обновлен", "result": result.success}

@setting_router.delete("/profile/delete")
async def delete_account(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await UserService(session).delete_user(user.userId)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"msg": "Аккаунт успешно удален", "result": result.success}

@setting_router.put("/profile/image/upload")
async def upload_image(file: UploadFile = File(...), user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ProfileService(session).update_image(user.userId, file)
    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )
    return {"msg": "Изображение успешно загружено", "result": result.success}


@setting_router.delete("/profile/image/delete")
async def delete_image(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ProfileService(session).delete_image(user.userId)
    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )
    return {"msg": "Изображение успешно удалено", "result": result.success}

@setting_router.put("/username/update")
async def update_username(request: UpdateUsernameRequest, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await UserService(session).update_username(user.userId, request.new_username, request.current_password)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"msg": "Username успешно обновлен", "result": result.success}


@setting_router.put("/email/update")
async def update_email(request: UpdateEmailRequest, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await UserService(session).update_email(user.userId, request.new_email, request.current_password)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"msg": "Email успешно обновлен", "result": result.success}

@setting_router.put("/password/update")
async def update_password(request: UpdatePasswordRequest, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await UserService(session).update_password(user.userId, request.new_password, request.current_password)

    if not result.success:
        raise HTTPException(
            status_code=400,
            detail=result.error
        )

    return {"msg": "Password успешно обновлен", "result": result.success}