
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.models import User
from app.database.repository.profile_repository import ProfileRepository

from app.schemas.get_access import authorize, register
from app.schemas.account.profile import UpdateProfile

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
            update_request.birthday,
            update_request.image
        )