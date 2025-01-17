from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.models import User
from app.database.repository.profile_repository import ProfileRepository
from uuid import uuid4

from app.schemas.account.profile import UpdateProfile, ProfileImage

from app.security.hasher import hash_password, verify_password
from app.security.jwtmanager import JWTManager

from app.utils.result import Result, err, success

class ProfileService:

    def __init__(self, session: AsyncSession):
        self._session = session
        self._repo: ProfileRepository = ProfileRepository(session)

    async def update_profile(self, userId: str, update_request: UpdateProfile):
        return await self._repo.update_profile(
            userId,
            update_request.name,
            update_request.about_me,
            update_request.birthday
        )

    async def update_image(self, userId: str, image_request: ProfileImage):
        return await self._repo.update_image(userId, image_request.image)
    
    async def delete_image(self, userId: str):
        return await self._repo.delete_image(userId)
    
    async def get_profile_by_username(self, username: str):
        profile = await self._repo.get_profile_by_username(username)
        if not profile:
            return err("Профиль не найден")
        return success(profile)

    async def get_image_by_username(self, username: str):
        image = await self._repo.get_image_by_username(username)
        if not image:
            return err("Изображение не найдено")
        return success(image)
    
    async def update_profile_name(self, userId: uuid4, new_name: str):
        return await self._repo.update_profile_name(userId, new_name)