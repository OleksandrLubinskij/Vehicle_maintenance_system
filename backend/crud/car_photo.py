from fastapi import Depends, APIRouter, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.exceptions import DBErrors, RecordNotFoundError
from app.cache.redis import RedisCache
from app.config import CACHE, CAR_PHOTO_PATH
import aiofiles

router = APIRouter()

@router.post("/upload/{car_id}")
async def upload_car_photo(car_id: int, raw_photo: UploadFile | None = None):
    print(CAR_PHOTO_PATH)
    await raw_photo.seek(0)
    photo = await raw_photo.read()
    photo_path = f"{CAR_PHOTO_PATH}/{raw_photo.filename}"
    async with aiofiles.open(photo_path, "wb") as file:
        await file.write(photo)
