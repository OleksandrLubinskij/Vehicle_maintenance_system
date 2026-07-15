import calendar
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from app.cache.redis import RedisCache
from app.config import CACHE
from app.models import FuelLog
from services.base_service import BaseCRUDService
from crud.fuel_log_db import FuelLogRepository

class FuelLogService(BaseCRUDService):
    def __init__(self, repo):
        super().__init__(repo)

    async def get_monthly_fuel_consumption(self, car_id: int):
        target_date = date.today()

        first_day = target_date.replace(day=1)

        _, days_in_month = calendar.monthrange(target_date.year, target_date.month)
        last_day = target_date.replace(day=days_in_month) 
        
        result = self.repo.get_total_fuel_in_range(car_id=car_id,
                                                   start_date=first_day,
                                                   end_date=last_day)
        return result
    
    # async def fetch_fuel_logs(self) -> list[FuelLog]:
    #     pass

    # async def fetch_fuel_log_by_id(self) -> FuelLog:
    #     pass

    # async def register_fuel_log(self) -> FuelLog:
    #     pass

    # async def update_fuel_log(self) -> FuelLog:
    #     pass

    # async def remove_fuel_log(self) -> bool:
    #     pass

