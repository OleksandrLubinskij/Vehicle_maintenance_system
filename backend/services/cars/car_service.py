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
from crud.cars_db import VehicleRepository
from services.fuel_logs.fuel_logs_service import FuelLogService
from services.maintenance_logs.maintenance_log_service import MaintenanceLogService

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
        # res = {}
        # for car in cars:
        #     indicators = await get_serivce_indicators(car.id, car.mileage,  self.db)
        #     # responce_car = CarResponse.model_validate(car)
        #     # responce_car.service_indicators = indicators
        #     # responce_car.monthly_fuel_consumption = car_monthly_fuel_consumption
        #     res[car.id] = {
        #         "base_car_info": car,
        #         "indicators": indicators,
        #     }
        #     await self.cache.hset(CACHE.CARS, car.id, res)

        return cars
    
    

    # async def get_serivce_indicators(car_id: int, 
    #                         current_mileage: int,  
    #                         db: AsyncSession):
    #     diffs = await calculate_maintenance_delta(car_id, current_mileage, db)

    #     output =  {
    #         key: evaluate_status(diff, LIMITATIONS[key])
    #         for key, diff in zip(LIMITATIONS.keys(), diffs)
    #     }
    #     worst_maintenance_code = max(output.values())
    #     output["worst_maintenance"] = worst_maintenance_code
    #     output["text_indicator"] = TEXT_INDICATORS[worst_maintenance_code]
    #     inspection_mileage = output.pop("inspection_mileage")
    #     inspection_time = output.pop("inspection_time")
    #     output["inspection"] = max((inspection_mileage, inspection_time))
    #     return output
    
    # async def fetch_vehicle_by_id(self, id:int) -> Car:
    #     car = await self.repo.get_by_id(id=id)
    #     if car is None:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
    #                             detail="Not found!")
    #     return car
    
    # async def register_vehicle(self, new_car: CarModel) -> Car:
    #     car = new_car.model_dump()
    #     car_obj = Car(**car)
    #     await self.repo.add(car_obj)
        
    # async def update_vehicle(self, id:int, new_data:CarUpdate) -> Car:
    #     data = new_data.model_dump()
    #     result = await self.repo.update(id, data)
    #     if result is None:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
    #                             detail="Not found!") 
        
    # async def remove_vehicle(self, id:int) -> bool:
    #     result = await self.repo.delete(id)
    #     if not result:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
    #                             detail="Not found")
    #     await self.repo.db.commit()