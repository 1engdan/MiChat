from pydantic import BaseModel
from typing import Optional
from datetime import date
import uuid

class _ProfileBase(BaseModel):
    name: Optional[str]
    about_me: Optional[str]

class ProfileCreate(_ProfileBase):
    pass

class Profile(_ProfileBase):
    iduser: uuid.UUID

    class Config:
        from_attributes = True

class UpdateProfile(_ProfileBase):
    pass

class ProfileImage(BaseModel):
    image: Optional[bytes]
