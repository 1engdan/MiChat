import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database.database import create_tables
from app.routers.main_router import main_router
from app.exc.email import BadEmail, bad_email_exception_handler
from starlette.middleware.cors import CORSMiddleware

api = FastAPI(
    title="MiChatAPI",
    description="The API docs for MiChat.",
    version="v1",
)

api.add_middleware (
    CORSMiddleware,
    allow_origins=["http://localhost:3333"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

api.include_router(main_router)

# Регистрация обработчика ошибок
api.add_exception_handler(BadEmail, bad_email_exception_handler)

@api.on_event("startup")
async def startup_event():
    await create_tables()

api.mount("/Uploads", StaticFiles(directory=f"{os.path.dirname(__file__)}/Uploads"), name="Uploads")