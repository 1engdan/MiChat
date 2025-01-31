import asyncio
from typing import Dict, List
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.user_services import UserService
from app.database.models.models import User
from app.security.jwtmanager import get_current_user
from app.services.chat_services import ChatService
from app.database.database import get_session
from app.schemas.chat.message import MessageRead, MessageCreate
import json
import base64

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

@chat_router.get("/chats/all")
async def get_all_chats(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await ChatService(session).get_chat_users(user.userId)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return result.value

@chat_router.post("/")
async def send_message(message: MessageCreate, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    # Проверка существования получателя
    recipient_user = await UserService(session).get_by_id(message.recipient)
    if not recipient_user:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    result = await ChatService(session).send_message(current_user.userId, message)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    message_data = {
        'senderId': current_user.userId,
        'recipientId': message.recipient,
        'content': message.content,
        'datecreated': result.value.datecreated.isoformat()
    }

    # Уведомляем получателя и отправителя через WebSocket
    await notify_user(message.recipient, message_data)
    await notify_user(current_user.userId, message_data)

    return {'recipient': message.recipient, 'content': message.content}

# Функция для отправки сообщения пользователю, если он подключен
async def notify_user(user_id: str, message: dict):
    """Отправить сообщение пользователю, если он подключен."""
    if user_id in active_connections:
        websocket = active_connections[user_id]
        # Отправляем сообщение в формате JSON
        await websocket.send_json(message)

active_connections: Dict[str, WebSocket] = {}

# WebSocket эндпоинт для соединений
@chat_router.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()  # Принимаем соединение
    active_connections[username] = websocket  # Сохраняем соединение пользователя
    print(f"WebSocket connection established for user: {username}")
    try:
        while True:
            await asyncio.sleep(1)  # Поддерживаем соединение активным
    except WebSocketDisconnect:
        active_connections.pop(username, None)  # Удаляем пользователя при отключении
        print(f"WebSocket connection closed for user: {username}")