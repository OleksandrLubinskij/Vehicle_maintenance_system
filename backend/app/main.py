from fastapi import FastAPI
from api.v1 import endpoints
from app.exceptions import DBErrors, RecordNotFoundError, general_db_errors_handler, record_not_found_error_handler
from fastapi.middleware.cors import CORSMiddleware
from app.config import CAR_PHOTO_PATH
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from scripts.create_super_user import create_super_user
import os
from alembic.config import Config
from alembic import command
from config import BASE_DIR

def run_migrations():
    print("Запуск міграцій Alembic...")
    
    alembic_cfg = Config(f"{BASE_DIR}/alembic.ini")
    database_url = os.getenv("DATABASE_URL")
    
    if database_url:
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
            
        alembic_cfg.set_main_option("sqlalchemy.url", database_url)
    
    command.upgrade(alembic_cfg, "head")
    print("Міграції успішно застосовано.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)