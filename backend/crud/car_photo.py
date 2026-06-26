from fastapi import Depends, APIRouter, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update
from app.database import get_db
from app.exceptions import RecordNotFoundError
from fastapi import HTTPException, status
from app.cache.redis import RedisCache
from app.config import CACHE, CAR_PHOTO_PATH
import aiofiles
from services.convert_images import convert_image_webp
from PIL import UnidentifiedImageError
from app.models import Car
import os

router = APIRouter()
cache = RedisCache()

@router.post("/upload/{car_id}")
async def upload_car_photo(car_id: int, raw_photo: UploadFile = File(...), db:AsyncSession=Depends(get_db)):
    try:
        photo = await convert_image_webp(raw_photo)
    except UnidentifiedImageError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="File isn`t valid or damaged!")
    original_name_without_ext = os.path.splitext(raw_photo.filename)[0]
    new_filename = f"{original_name_without_ext}.webp"
    stmt = update(Car
                    ).where(Car.id == car_id
                    ).values(photo_path=new_filename)
    result = await db.execute(stmt)
    if result.rowcount == 0:
        raise RecordNotFoundError
    
    photo_path = f"{CAR_PHOTO_PATH}/{new_filename}"
    async with aiofiles.open(photo_path, "wb") as file:
        await file.write(photo)

    await db.commit()
    await cache.delete(CACHE.CARS)
    return {"message": "Photo uploaded!"}