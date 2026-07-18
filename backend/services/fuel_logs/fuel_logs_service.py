import calendar
from datetime import date
from services.base_service import BaseCRUDService
from app.schemas import FuelLogModel
from app.models import FuelLog
class FuelLogService(BaseCRUDService):
    def __init__(self, repo):
        super().__init__(repo)

    async def get_monthly_fuel_consumption(self, car_id_list: list[int]):
        target_date = date.today()

        first_day = target_date.replace(day=1)

        _, days_in_month = calendar.monthrange(target_date.year, target_date.month)
        last_day = target_date.replace(day=days_in_month) 
        
        result = await self.repo.get_total_fuel_in_range(car_id_list=car_id_list,
                                                   start_date=first_day,
                                                   end_date=last_day)
        return result
    
    async def register(self, car_id:int, new_fuel_log_data: FuelLogModel):
        data = new_fuel_log_data.model_dump()
        data["car_id"] = car_id
        fuel_log = FuelLog(**data)
        await self.repo.add(fuel_log)

    

