from fastapi import FastAPI
from api.v1 import endpoints
from app.exceptions import DBErrors, RecordNotFoundError, general_db_errors_handler, record_not_found_error_handler
from fastapi.middleware.cors import CORSMiddleware
from app.config import CAR_PHOTO_PATH
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.scripts.create_super_user import create_super_user
import os
from alembic.config import Config
from alembic import command

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_super_user()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(endpoints.api_router)

app.add_exception_handler(DBErrors, general_db_errors_handler)
app.add_exception_handler(RecordNotFoundError, record_not_found_error_handler)

app.mount("/car_photos", StaticFiles(directory=CAR_PHOTO_PATH), name="photos")
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://vehicle-maintenance-system-frontend.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)