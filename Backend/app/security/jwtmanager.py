from datetime import timedelta
import datetime
from typing import Optional
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jwt import encode, decode
from sqlalchemy.ext.asyncio import AsyncSession
from app.cfg.settings import settings
from app.database.models.models import User
from app.database.repository.user_repository import UserRepository
from app.database.database import get_session
from app.utils.result import Result, err, success
from app.security.hasher import verify_password
from app.security.jwttype import JWTType

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/a/authorize")

class JWTManager:
    def __init__(self):
        self.SECRET_KEY = settings.JWT_SECRET_KEY
        self.ALGORITHM = settings.JWT_ALGORITHM
        self.ACCESS_TOKEN_LIFETIME = settings.JWT_ACCESS_TOKEN_LIFETIME_MINUTES
        self.REFRESH_TOKEN_LIFETIME = settings.JWT_REFRESH_TOKEN_LIFETIME_HOURS

    def encode_token(self, payload, token_type: JWTType = JWTType.ACCESS):
        jwt_payload = payload.copy()
        current_time = datetime.datetime.utcnow()
        expire = timedelta(minutes=self.ACCESS_TOKEN_LIFETIME) if token_type == JWTType.ACCESS else timedelta(hours=self.REFRESH_TOKEN_LIFETIME)
        jwt_payload.update({"exp": current_time + expire})
        return encode(jwt_payload, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def decode_token(self, token: str) -> Result[dict]:
        try:
            return success(decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM]))
        except:
            return err("Invalid token")

    async def refresh_access_token(self, refresh_token: str, session: AsyncSession) -> Result[str]:
        token_data = self.decode_token(refresh_token)
        if token_data.error:
            return err(token_data.error)

        user = await UserRepository(session).get_by_filter_one(userId=token_data.value["userId"])
        if not user:
            return err("User not found")

        access_token = self.encode_token({"userId": str(user.userId), "email": user.email}, token_type=JWTType.ACCESS)
        return success(access_token)

async def get_current_user(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)) -> User:
    jwt_manager = JWTManager()
    payload = jwt_manager.decode_token(token)
    if not payload.success:
        raise HTTPException(
            status_code=401,
            detail=payload.error,
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.value.get("userId")
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await UserRepository(session).get_by_filter_one(userId=user_id)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
    
def get_token(request: Request):
    token = request.cookies.get('users_access_token')
    if not token:
        raise TokenNoFoundException
    return token