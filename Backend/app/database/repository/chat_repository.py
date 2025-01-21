from app.utils.result import *
from ..abstract.abc_repository import AbstractRepository
from app.database.models.models import Message
from sqlalchemy import and_, or_, select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4

class ChatRepository(AbstractRepository):
    model = Message

    async def get_messages_between_users(self, user_id1: uuid4, user_id2: uuid4):
        query = select(self.model).filter(
            or_(
                and_(self.model.senderId == user_id1, self.model.recipientId == user_id2),
                and_(self.model.senderId == user_id2, self.model.recipientId == user_id1)
            )
        ).order_by(self.model.datecreated)

        result = await self._session.execute(query)
        return result.scalars().all()

    async def send_message(self, user_id1: uuid4, content: str, user_id2: uuid4):
        query = insert(self.model).values(senderId=user_id1, recipientId=user_id2, message=content).returning(self.model)
        result = await self._session.execute(query)
        await self._session.commit()
        return result.scalars().first()
