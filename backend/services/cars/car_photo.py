# # from fastapi import Depends, APIRouter, UploadFile, File
# # from app.exceptions import NotFoundError
# # from fastapi import HTTPException, status
# # from app.cache.redis import RedisCache
# # from app.config import CACHE, CAR_PHOTO_PATH
# # import aiofiles
# # from app.utils.convert_images import convert_image_webp
# # from app.models import Car
# # from app.s3.s3_client import S3Client
# # from app.s3.fabric_s3 import get_s3
# # from services.cars.car_service import VehicleService
# # import os
# router = APIRouter()
# cache = RedisCache()

# S3_FOLDER = "car_photos"
# CAR_PHOTOS_URL = os.getenv("CAR_PHOTOS_URl")
# async def car_photo_download(car_id: int, 
#                              raw_photo: bytes,
#                              vehicle_service: VehicleService,
#                              s3: S3Client = Depends(get_s3)):
#     photo = await convert_image_webp(raw_photo)
    
#     object_name = f"{S3_FOLDER}/car_{car_id}.webp"
#     new_file_path = f"{CAR_PHOTOS_URL}/{object_name}"
    

#     result = await vehicle_service.edit_car_photo(id=car_id,
#                                                   new_car_photo=new_file_path)

#     if result.rowcount == 0:
#         raise NotFoundError()
    
#     await s3.upload_file(photo, object_name, content_type="image/webp")



# # @router.put("/edit_car_photo/{car_id}")
# # async def edit_car_photo(car_id: int, raw_photo: UploadFile = File(...), db:AsyncSession=Depends(get_db)):
# #     stmt = select(
# #         Car.photo_path
# #         ).where(
# #             Car.id == car_id
# #         )
# #     old_photo = (await db.execute(stmt)).scalar_one_or_none()

# #     if old_photo is None:
# #         raise RecordNotFoundError

# #     if old_photo:
# #         old_object_name = f"{S3_FOLDER}/{old_photo}"
# #         await s3.delete_file(old_object_name)
# #     return await car_photo_download(car_id, raw_photo, db)

    

