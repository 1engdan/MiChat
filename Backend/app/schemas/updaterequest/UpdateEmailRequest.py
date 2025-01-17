from pydantic import BaseModel

class UpdateEmailRequest(BaseModel):
    new_email: str
    current_password: str