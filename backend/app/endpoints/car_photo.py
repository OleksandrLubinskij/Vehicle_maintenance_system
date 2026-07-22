from fastapi import APIRouter, File, HTTPException, UploadFile, status, Depends
from services.cars.fabric_car_service import get_vehicle_service
from services.cars.car_service import VehicleService
from PIL import UnidentifiedImageError
from app.s3.fabric_s3 import get_s3
from app.s3.s3_client import S3Client
router = APIRouter()

@router.post("/upload/{car_id}")
async def upload_car_photo(car_id: int, 
                           new_car_photo: UploadFile = File(...),
                           vehicle_service: VehicleService = Depends(get_vehicle_service),
                           s3: S3Client = Depends(get_s3)):
    image_bytes = await new_car_photo.read()
    try:
        await vehicle_service.car_photo_download(car_id, image_bytes, s3)
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Неправильний тип файлу або його пошкоджено!"
        )
