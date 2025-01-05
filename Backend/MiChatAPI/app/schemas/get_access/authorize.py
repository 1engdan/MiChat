import re
from pydantic import BaseModel, EmailStr, ValidationError, field_validator
from typing import Union
from app.exc import email

class AuthorizeRequest(BaseModel):
    login: Union[EmailStr, str]
    password: str

    @field_validator("login")
    def validate_login(cls, v):
        if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", v):
            if not re.match(r"^[a-zA-Z0-9_]+$", v):
                raise email.BadEmail()
        return v