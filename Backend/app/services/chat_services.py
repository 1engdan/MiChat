from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from app.utils.result import err, success, Result
from app.database.repository.user_repository import UserRepository
from app.database.repository.chat_repository import ChatRepository
from app.schemas.chat.message import MessageCreate

class ChatService:
    def __init__(self, session: AsyncSession):
        self._session = session
        self._chat_repository: ChatRepository = ChatRepository(session)
        self._user_repo: UserRepository = UserRepository(session)

    async def get_messages_between_users(self, username: str, user_id2: uuid4):
        user1 = await self._user_repo.get_by_username(username)
        if not user1:
            return err("Пользователь не найден")
        result = await self._chat_repository.get_messages_between_users(user1.userId, user_id2)
        if not result:
            return err("Чат не найден")
        return success(result)

    async def send_message(self, user_id: uuid4, message: MessageCreate):
        recipient = await self._user_repo.get_by_username(message.recipient)
        if not recipient:
            return err("Пользователь не найден")
        result = await self._chat_repository.send_message(user_id, message.content, recipient.userId)
        if not result:
            return err("Сообщение не отправлено")
        return success(result)
