from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from api.v1 import routes
from app.exceptions import DBErrors, RecordNotFoundError, general_db_errors_handler, record_not_found_error_handler
from fastapi.middleware.cors import CORSMiddleware
from app.config import CAR_PHOTO_PATH
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.scripts.create_super_user import create_super_user
from api.v1.auth.exceptions import InvalidPasswordError, UserAlreadyExistsError, UserNotFoundError, NotAuthenticatedError, PermissionDeniedError


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_super_user()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(routes.api_router)

app.add_exception_handler(DBErrors, general_db_errors_handler)
app.add_exception_handler(RecordNotFoundError, record_not_found_error_handler)

app.mount("/car_photos", StaticFiles(directory=CAR_PHOTO_PATH), name="photos")
origins = [
    "https://vehicle-maintenance-system-frontend.onrender.com",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": {"code": 1, "message": "Користувача не знайдено"}}
    )

@app.exception_handler(InvalidPasswordError)
async def invalid_password_handler(request: Request, exc: InvalidPasswordError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": f"{exc.error_detail}"} if exc.error_detail else {"detail": {"code": 2, "message": "Неправильний пароль!"}}
    )

@app.exception_handler(UserAlreadyExistsError)
async def user_exists_handler(request: Request, exc: UserAlreadyExistsError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": {"code": 0, "message": "Користувач з таким іменем уже існує"}}
    )

@app.exception_handler(NotAuthenticatedError)
async def not_authenticated(request: Request, exc: NotAuthenticatedError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": f"{exc.error_detail}"}
    )

@app.exception_handler(PermissionDeniedError)
async def not_authenticated(request: Request, exc: PermissionDeniedError):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": f"You do not have rights to perform this operation!"}
    )