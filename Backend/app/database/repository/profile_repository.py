from app.utils.result import *
from ..abstract.abc_repository import AbstractRepository
from app.database.models.models import Profile, User
from datetime import date
from sqlalchemy import CursorResult, delete, select, update, insert
from typing import Optional
from uuid import uuid4

class ProfileRepository(AbstractRepository):
    model = Profile

    async def create_profile(self, user_id: uuid4, name: str):
        query = insert(self.model).values(iduser=user_id, name=name).returning(self.model)
        result = await self._session.execute(query)
        return result.scalars().first()

    async def update(self, userId: str, **kwargs):
        query = update(self.model).where(self.model.iduser == userId).values(**kwargs).returning(self.model)
        result = await self._session.execute(query)
        await self._session.commit()
        return result.scalars().first()

    async def update_profile(self,
                             userId: str,
                             name: Optional[str],
                             about_me: Optional[str],
                             ) -> Result[None]:
        query = (
            select(self.model)
            .where(self.model.iduser == userId)
        )

        result = await self._session.execute(query)
        profile = result.scalars().one_or_none()
        if not profile:
            creating = await self.create_profile(user_id=userId, name=name)
            return success(creating) if creating else err("Ошибка при попытке создания ресурса.")

        if not name:
                # Если имя не указано, используем username из таблицы users
                user_query = select(User).where(User.userId == userId)
                user_result = await self._session.execute(user_query)
                user = user_result.scalars().first()
                if user:
                    name = user.username
                    
        # Обновление профиля
        update_data = {
            "name": name,
            "about_me": about_me
        }

        updated_profile = await self.update(userId=userId, **update_data)
        return success(updated_profile)

    async def update_image(self, userId: str, image: bytes) -> Result[None]:
        query = update(self.model).where(self.model.iduser == userId).values(image=image).returning(self.model)
        result = await self._session.execute(query)
        await self._session.commit()
        return success(result.scalars().first())
    
    async def delete_image(self, userId: str) -> Result[None]:
        query = update(self.model).where(self.model.iduser == userId).values(image=None).returning(self.model)
        result = await self._session.execute(query)
        await self._session.commit()
        return success(result.scalars().first())

    async def get_profile_by_username(self, username: str) -> Optional[Profile]:
        query = (
            select(self.model)
            .join(User, self.model.iduser == User.userId)
            .where(User.username == username)
        )
        result = await self._session.execute(query)
        return result.scalars().first()

    async def get_image_by_username(self, username: str) -> Optional[bytes]:
        query = (
            select(self.model.image)
            .join(User, self.model.iduser == User.userId)
            .where(User.username == username)
        )
        result = await self._session.execute(query)
        return result.scalars().first()
    
    async def update_profile_name(self, userId: uuid4, new_name: str) -> Result[None]:
        query = (
            update(self.model)
            .where(self.model.iduser == userId)
            .values(name=new_name)
            .returning(self.model)
        )
        result = await self._session.execute(query)
        await self._session.commit()
        return success(result.scalars().first())