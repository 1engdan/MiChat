import re
from pydantic import BaseModel, field_validator
from app.exc import email

class RegisterRequest(BaseModel):
    email: str
    password: str
    username:str

    @field_validator("email")
    def validate_email(cls, attr):
        if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", attr):
            raise email.BadEmail()
        return attr