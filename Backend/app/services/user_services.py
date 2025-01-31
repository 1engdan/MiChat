import re
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from uuid import uuid4

from app.database.repository.user_repository import UserRepository
from app.database.repository.profile_repository import ProfileRepository

from app.schemas.get_access import register
from app.exc.email import BadEmail
from app.utils.result import Result, err, success
from app.security.hasher import hash_password, verify_password

class UserService:
    def __init__(self, session: AsyncSession):
        self._session = session
        self._repo: UserRepository = UserRepository(session)
        self._repoProfile: ProfileRepository = ProfileRepository(session)

    async def register(self, register_request: register) -> Result[None]:
        try:
            # Проверка существования пользователя
            exists_info = await self._repo.user_exists(email=register_request.email, username=register_request.username)

            if exists_info["email_exists"] and exists_info["username_exists"]:
                return err("Пользователь с таким email и username уже существует.")
            if exists_info["email_exists"]:
                return err("Пользователь с таким email уже существует.")
            if exists_info["username_exists"]:
                return err("Пользователь с таким username уже существует.")

            new_user = await self._repo.create(email=register_request.email, username=register_request.username, password=hash_password(register_request.password))
            await self._repoProfile.create_profile(user_id=new_user.userId, name=register_request.username)
            await self._repo.commit()
            await self._repoProfile.commit()
        except IntegrityError as e:
            return err('error: ' + str(e))
        except BadEmail as e:
            return err(str(e))
        return success("Пользователь успешно зарегистрирован.")

    async def authorize(self, email: str, password: str):
        authenticated = await self._repo.authenticate_user(email, password)
        if not authenticated.success:
            return err(authenticated.error)
        return Result(success=True, value=authenticated.value)
        

    async def get_by_email(self, email: str):
        user = await self._repo.get_by_email(email)
        return success(user) if user else err("Пользователь не найден.")

    async def get_by_username(self, username: str):
        user = await self._repo.get_by_username(username)
        return success(user) if user else err("Пользователь не найден.")

    async def get_by_id(self, id: uuid4):
        user = await self._repo.get_by_id(id)
        return success(user) if user else err("Пользователь не найден.")

    async def confirm_email(self, userId: str):
        return await self._repo.update_by_id(userId, is_mail_verified=True)

    async def is_username_available(self, username: str) -> Result[None]:
        user = await self._repo.get_by_username(username)
        if user:
            return err("Это имя пользователя уже занято.")
        return success("Это имя пользователя доступно.")

    async def is_email_verified(self, email: str) -> Result[None]:
        user = await self._repo.get_by_filter_one(email=email)
        if not user:
            return err("Пользователь не найден.")
        if not user.is_mail_verified:
            return err("Почта не подтверждена. Если кода нет, запросите его повторно")
        return success("Почта подтверждена.")

    async def delete_user(self, userId: str) -> Result[None]:
        return await self._repo.delete_user_and_profile(userId)

    async def update_username(self, userId: uuid4, new_username: str, current_password: str):
        user = await self._repo.get_by_id(userId)
        if not user or not verify_password(current_password, user.password):
            return err("Неверный пароль")

        # Обновляем username в таблице users
        result = await self._repo.update_username(userId, new_username)
        if not result.success:
            return result

        # Если имя в профиле совпадает с текущим username, обновляем его
        if user.username == new_username:
            profile_result = await self._repoProfile.update_profile_name(userId, new_username)
            if not profile_result.success:
                return profile_result

        return result

    async def update_email(self, userId: uuid4, new_email: str, current_password: str):
        user = await self._repo.get_by_id(userId)
        if not user or not verify_password(current_password, user.password):
            return err("Неверный пароль")

        # Проверка формата email
        email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_pattern, new_email):
            raise BadEmail()

        return await self._repo.update_email(userId, new_email)

    async def update_password(self, userId: uuid4, new_password: str, current_password: str):
        user = await self._repo.get_by_id(userId)
        if not user or not verify_password(current_password, user.password):
            return err("Неверный пароль")
        return await self._repo.update_password(userId, new_password)