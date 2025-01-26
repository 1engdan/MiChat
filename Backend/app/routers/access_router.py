from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from app.security.jwttype import JWTType
from app.database.repository.user_repository import UserRepository
from app.schemas.AccessToken import AccessToken
from app.security.jwtmanager import JWTManager
from app.utils.result import Result, err
from app.database.database import get_session
from app.schemas.get_access.register import RegisterRequest
from app.services.user_services import UserService
from sqlalchemy.ext.asyncio import AsyncSession

auth_router = APIRouter(prefix="/a", tags=["System Access"])

@auth_router.post("/register")
async def register(register_request: RegisterRequest, session: AsyncSession = Depends(get_session)):
    result = await UserService(session).register(register_request)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)
    return {"msg register": result.value}

@auth_router.post("/authorize")
async def authorize(username: str = Form(), password: str = Form(), session: AsyncSession = Depends(get_session)):
    print(f"Received username: {username}, password: {password}")
    user = await UserRepository(session).get_by_filter_one(email=username)

    authorized = await UserService(session).authorize(username, password)
    if not authorized.success:
        raise HTTPException(status_code=401, detail=authorized.error)

    jwt_manager = JWTManager()
    access_token = jwt_manager.encode_token({ "userId": str(user.userId) }, token_type=JWTType.ACCESS)
    refresh_token = jwt_manager.encode_token({ "userId": str(user.userId) }, token_type=JWTType.REFRESH)
    return AccessToken(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer"
    )



async def refresh_access_token(request: Request):
    
    cookies = request.cookies
    refresh_token = cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is not provided")

    jwt_manager = JWTManager()
    token_data = jwt_manager.decode_token(refresh_token)
    if token_data.error:
        raise HTTPException(status_code=400, detail=token_data.error)


    session: AsyncSession = await get_session()
    user = await UserRepository(session).get_by_filter_one(userId=token_data.value["userId"])
    session.close()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    return jwt_manager.encode_token({ "userId": str(user.userId), "email": user.email }, token_type=JWTType.ACCESS)

@auth_router.get("/refresh")
async def refresh(token: str = Depends(refresh_access_token)):
    response = JSONResponse(content = {
        "access_token": token
    })
    response.set_cookie(key="access_token", value=token, httponly=True)
    return response