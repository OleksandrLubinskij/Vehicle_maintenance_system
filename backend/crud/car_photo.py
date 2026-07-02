from fastapi import Depends, APIRouter, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, select
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
from app.s3.s3_client import S3Client

router = APIRouter()
cache = RedisCache()

BUCKET_NAME=os.getenv("BUCKET_NAME")
ENDPOINT_URL=os.getenv("ENDPOINT_URL")
ACCESS_KEY=os.getenv("ACCESS_KEY")
SECRET_S3_KEY=os.getenv("SECRET_S3_KEY")
CAR_PHOTOS_URL = os.getenv("CAR_PHOTOS_URl")
s3 = S3Client(
    access_key=ACCESS_KEY,
    secret__s3_key=SECRET_S3_KEY,
    endpoint_url=ENDPOINT_URL,
    bucket_name=BUCKET_NAME
)

S3_FOLDER = "car_photos"
async def car_photo_download(car_id: int, raw_photo: UploadFile, db: AsyncSession):
    try:
        photo = await convert_image_webp(raw_photo)
    except UnidentifiedImageError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="File isn`t valid or damaged!")
    
    object_name = f"{S3_FOLDER}/car_{car_id}.webp"
    new_file_path = f"{CAR_PHOTOS_URL}/{object_name}"
    

    stmt = update(Car
                    ).where(Car.id == car_id
                    ).values(photo_path=new_file_path)
    result = await db.execute(stmt)

    if result.rowcount == 0:
        raise RecordNotFoundError
    
    await s3.upload_file(photo, object_name, content_type="image/webp")

    await db.commit()
    await cache.delete(CACHE.CARS)
    return {"message": "Photo uploaded!"}

@router.post("/upload/{car_id}")
async def upload_car_photo(car_id: int, raw_photo: UploadFile = File(...), db:AsyncSession=Depends(get_db)):
    await car_photo_download(car_id, raw_photo, db)

@router.put("/edit_car_photo/{car_id}")
async def edit_car_photo(car_id: int, raw_photo: UploadFile = File(...), db:AsyncSession=Depends(get_db)):
    stmt = select(
        Car.photo_path
        ).where(
            Car.id == car_id
        )
    old_photo = (await db.execute(stmt)).scalar_one_or_none()

    if old_photo is None:
        raise RecordNotFoundError

    if old_photo:
        old_object_name = f"{S3_FOLDER}/{old_photo}"
        await s3.delete_file(old_object_name)
    return await car_photo_download(car_id, raw_photo, db)

    

