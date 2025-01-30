from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.models import User
from app.security.jwtmanager import get_current_user
from app.services.chat_services import ChatService
from app.database.database import get_session
from app.schemas.chat.message import MessageRead, MessageCreate
from app.schemas.account.users import User as UserList

chat_router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@chat_router.get("/{username}", response_model=List[MessageRead])
async def get_messages(username: str, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ChatService(session).get_messages_between_users(username, current_user.userId)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return result.value

@chat_router.post("/")
async def send_message(message: MessageCreate, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ChatService(session).send_message(current_user.userId, message)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return {'recipient': message.recipient, 'content': message.content}


@chat_router.get("/chats/all")
async def get_all_chats(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ChatService(session).get_chat_users(user.userId)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return result.value