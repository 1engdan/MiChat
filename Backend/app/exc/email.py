from fastapi import Request
from fastapi.responses import JSONResponse

class BadEmail(Exception):
    def __init__(self, message="Некорректный формат email"):
        self.message = message
        super().__init__(self.message)

async def bad_email_exception_handler(request: Request, exc: BadEmail):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.message},
    )