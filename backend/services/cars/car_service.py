from app.config import CACHE, CAR_PHOTOS_URL, S3_FOLDER
from app.models import Car
from app.s3.s3_client import S3Client
from app.utils.convert_images import convert_image_webp
from services.base_service import BaseCRUDService
from app.exceptions import NotFoundError
class VehicleService(BaseCRUDService):
    def __init__(self, repo, cache):
        super().__init__(repo)
        self.cache = cache

    async def fetchVehicles(self) -> list[Car]:
        cars_cached = await self.cache.get_all_cached(CACHE.CARS)
        total_in_db = await self.repo.count()
        if cars_cached and total_in_db == len(cars_cached):
            return cars_cached
        
        cars = await self.repo.get_all()
        return cars

    async def update_photo_path(self, car_id: int, photo_path: str):
        result = await self.repo.update_car_photo_path(car_id, photo_path)
        if result is None:
            raise NotFoundError()
        

    async def car_photo_download(self, 
                                car_id: int, 
                                new_car_photo: bytes,
                                s3: S3Client):
        
        old_photo = await self.repo.get_by_id(id=car_id,
                                              fields=["photo_path"])

        if old_photo:
            old_object_name = f"{S3_FOLDER}/{old_photo}"
            await s3.delete_file(old_object_name)

        photo = await convert_image_webp(new_car_photo)
        
        object_name = f"{S3_FOLDER}/car_{car_id}.webp"
        new_file_path = f"{CAR_PHOTOS_URL}/{object_name}"
        await self.update_photo_path(car_id=car_id, photo_path=new_file_path)
        await s3.upload_file(photo, object_name, content_type="image/webp")
    
        