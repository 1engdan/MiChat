import re

from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response

from app.database.database import get_session
from app.schemas.get_access.register import RegisterRequest
from app.services.user_services import UserService
from app.utils.result import Result, err, success

from app.security.jwttype import JWTType
from app.security.jwtmanager import JWTManager

from app.exc.email import BadEmail
from sqlalchemy.ext.asyncio import AsyncSession

auth_router = APIRouter(prefix="/a", tags=["System Access"])

@auth_router.post("/register")
async def register(registerRequest: RegisterRequest, session: AsyncSession = Depends(get_session)):
  result = await UserService(session).register(registerRequest)
  if not result.success:
    raise HTTPException(status_code=400, detail=result.error)
  return {
    "msg register": result.value
  }

@auth_router.post("/authorize")
async def authorize(username: str = Form(), password: str = Form(), session: AsyncSession = Depends(get_session)):
    # Проверка, что email является действительным адресом электронной почты
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, username):
        raise HTTPException(status_code=400, detail="Некорректный формат email")

    result = await UserService(session).authorize(username, password)

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return {
    "msg authorize": result.value
  } 

# async def refresh_access_token(request: Request):
    
#     cookies = request.cookies
#     refresh_token = cookies.get("refresh_token")
#     if not refresh_token:
#         raise HTTPException(status_code=400, detail="Refresh token is not provided")

#     jwt_manager = JWTManager()
#     token_data = jwt_manager.decode_token(refresh_token)
#     if token_data.error:
#         raise HTTPException(status_code=400, detail=token_data.error)


#     session: AsyncSession = await get_session()
#     user = await UserRepository(session).get_by_filter_one(userId=token_data.value["userId"])
#     session.close()
#     if not user:
#         raise HTTPException(status_code=400, detail="User not found")
    
#     return jwt_manager.encode_token({ "userId": str(user.userId), "email": user.email }, token_type=JWTType.ACCESS)

# @auth_router.get("/refresh")
# async def refresh(token: str = Depends(refresh_access_token)):
#     response = JSONResponse(content = {
#         "access_token": token
#     })
#     response.set_cookie(key="access_token", value=token, httponly=True)
#     return response