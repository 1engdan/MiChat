from pydantic import BaseModel

class UpdateUsernameRequest(BaseModel):
    new_username: str
    current_password: str
