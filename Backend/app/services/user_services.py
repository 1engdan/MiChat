from typing import List, Sequence
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.AccessToken import AccessToken
from app.database.models.models import User
from app.database.repository.user_repository import UserRepository
from app.database.repository.profile_repository import ProfileRepository

from app.schemas.get_access import register

from app.utils.result import Result, err, success

from app.security.hasher import hash_password, verify_password

from app.security.jwtmanager import JWTManager, get_current_user
from app.security.jwttype import JWTType

class UserService:
    def __init__(self, session: AsyncSession):
        self._session = session
        self._repo: UserRepository = UserRepository(session)
        self._repoProfile: ProfileRepository = ProfileRepository(session)

    async def register(self, register_request: register.RegisterRequest) -> Result[None]:
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
        return success("Пользователь успешно зарегистрирован.")
    
    async def authorize(self, email: str, password: str) -> Result[AccessToken]:
        authenticated = await self._repo.authenticate_user(email, password)

        if not authenticated.success:
            return err("Неправильный email или пароль")

        user = authenticated.value
        jwt_manager = JWTManager()
        access_token = jwt_manager.encode_token({"userId": str(user.userId)}, token_type=JWTType.ACCESS)
        refresh_token = jwt_manager.encode_token({"userId": str(user.userId)}, token_type=JWTType.REFRESH)

        return success(AccessToken(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer"
        ))

    async def get_by_email(self, email: str):
        user = await self._repo.get_by_email(email)
        return success(user) if user else err("Пользователь не найден.")

    async def get_by_username(self, username: str):
        user = await self._repo.get_by_username(username)
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

    # async def delete_user(self, token: str):
    #     user: User = await get_current_user(token, self._session)
    #     return await self._repo.delete_by_id(user.userId)

    async def delete_user(self, userId: str) -> Result[None]:
        return await self._repo.delete_user_and_profile(userId)