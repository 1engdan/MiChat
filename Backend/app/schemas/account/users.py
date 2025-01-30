from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
import uuid

class _UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(_UserBase):
    password: str

class User(_UserBase):
    userId: uuid.UUID
    datacreated: Optional[date]
    dataupdated: Optional[date]

    class Config:
        from_attributes = True