from pydantic import BaseModel

class CheckUsernameRequest(BaseModel):
    username: str