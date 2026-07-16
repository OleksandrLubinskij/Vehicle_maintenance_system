from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.cache.redis import RedisCache
from app.config import CACHE
from app.enums import MaintenanceType
from app.models import Car
from app.schemas import CarModel, CarUpdate
from app.exceptions import DBErrors
from services.base_service import BaseCRUDService
from services.cars.car_indicators_service import get_serivce_indicators

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
