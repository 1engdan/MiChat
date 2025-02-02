import os
import aiofiles
import shutil
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository.profile_repository import ProfileRepository
from uuid import uuid4

from app.schemas.account.profile import UpdateProfile, ProfileImage

from app.utils.result import Result, err, success

class ProfileService:

    def __init__(self, session: AsyncSession):
        self._session = session
        self._repo: ProfileRepository = ProfileRepository(session)

    async def update_profile(self, userId: str, update_request: UpdateProfile):
        return await self._repo.update_profile(
            userId,
            update_request.name,
            update_request.about_me
        )

    async def update_image(self, userId: str, file: UploadFile):
    # Получение текущего пути к изображению
        profile = await self._repo.get_by_user_id(userId)
        if profile and profile.imgUrl:
            old_file_path = profile.imgUrl
            # Удаление старого файла, если он существует
            if os.path.exists(old_file_path):
                os.remove(old_file_path)

        # Генерация нового уникального имени файла
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid4()}.{file_extension}"
        file_path = f"Uploads/ProfileImg/{unique_filename}"

        # Обновление записи в базе данных
        img = await self._repo.update_one(userId, imgUrl=file_path)

        # Асинхронное сохранение файла
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()  # async read
            await out_file.write(content)  # async write

        return success(img)

    async def delete_image(self, userId: str):
        # Получение текущего пути к изображению
        profile = await self._repo.get_by_user_id(userId)
        if profile and profile.imgUrl:
            file_path = profile.imgUrl

            # Удаление файла
            if os.path.exists(file_path):
                os.remove(file_path)

            # Обновление записи в базе данных
            await self._repo.update_one(userId, imgUrl=None)

            return success("Изображение успешно удалено")
        else:
            return err("Изображение не найдено")
    
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