from pydantic import BaseModel

class UpdatePasswordRequest(BaseModel):
    new_password: str
    current_password: str