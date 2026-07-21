from app.config import CACHE
from app.models import Car
from services.base_service import BaseCRUDService

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
