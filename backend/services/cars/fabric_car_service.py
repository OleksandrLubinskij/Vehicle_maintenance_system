from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache.redis import RedisCache, get_redis_cache
from app.database import get_db
from crud.cars_db import VehicleRepository
from services.cars.car_service import VehicleService

def get_vehicle_repo(db: AsyncSession = Depends(get_db)) -> VehicleRepository:
    return VehicleRepository(db=db)

def get_vehicle_service(cache: RedisCache = Depends(get_redis_cache),
                        repo: VehicleRepository = Depends(get_vehicle_repo)) -> VehicleService:
      return VehicleService(cache=cache, repo=repo)