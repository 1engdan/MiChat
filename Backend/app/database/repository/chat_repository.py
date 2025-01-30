import logging
from app.utils.result import *
from ..abstract.abc_repository import AbstractRepository
from app.database.models.models import Message, User
from sqlalchemy import and_, or_, select, insert, distinct
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

class ChatRepository(AbstractRepository):
    model = Message
    modelUser = User

    async def get_messages_between_users(self, user_id1: UUID, user_id2: UUID):
        query = select(self.model).filter(
            or_(
                and_(self.model.senderId == user_id1, self.model.recipientId == user_id2),
                and_(self.model.senderId == user_id2, self.model.recipientId == user_id1)
            )
        ).order_by(self.model.datecreated)

        result = await self._session.execute(query)
        return result.scalars().all()

    async def send_message(self, user_id1: UUID, content: str, user_id2: UUID):
        query = insert(self.model).values(senderId=user_id1, recipientId=user_id2, message=content).returning(self.model)
        result = await self._session.execute(query)
        await self._session.commit()
        return result.scalars().first()

    async def get_chat_users(self, user_id: UUID):
       query = (
           select(User.username.label("chat_name"))
           .select_from(self.model)
           .where(or_(self.model.senderId==user_id, self.model.recipientId==user_id))
           .join(User, self.model.recipientId==user_id or self.model.senderId==user_id)
        )
       
       result = await self._session.execute(query)
       return result.mappings().all()