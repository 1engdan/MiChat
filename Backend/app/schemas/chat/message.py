from pydantic import BaseModel
from typing import Optional
from datetime import datetime, time
import uuid

class _MessageBase(BaseModel):
    pass

class MessageCreate(_MessageBase):
    recipient: str
    content: str

class MessageRead(_MessageBase):
    senderId: uuid.UUID
    recipientId: uuid.UUID
    message: str
    datecreated: datetime

class Message(_MessageBase):
    iduser: uuid.UUID

    class Config:
        from_attributes = True

class UpdateMessage(_MessageBase):
    pass
