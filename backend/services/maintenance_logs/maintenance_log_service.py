from services.base_service import BaseCRUDService
from app.schemas import MaintainenceLogModel
from app.models import MaintenanceLog
class MaintenanceLogService(BaseCRUDService):
    def __init__(self, repo):
        super().__init__(repo)
    
    async def fetch_last_maintenance_logs(self, car_id_list: list):
        records = await self.repo.get_last_maintenances(car_id_list)
        return records
    
    async def register(self, car_id:int, new_data: MaintainenceLogModel):
        data = new_data.model_dump()
        data["car_id"] = car_id
        record = MaintenanceLog(**data)
        await self.repo.add(record)

    async def fetch_by_car_id(self,
                          car_id: int,
                          maintenance_type: str | None = None,
                          sort_order: str | None = None, 
                          limit: int = 10,
                          offset: int = 0):

        actual_maintenance_type = maintenance_type if maintenance_type != "Усі" else None
        actual_sort_order = sort_order if sort_order == "asc" else "desc"

        result = await self.repo.get_maintenance_logs_by_car_id(car_id=car_id,
                                                                maintenance_type=actual_maintenance_type,
                                                                sort_order=actual_sort_order,
                                                                limit=limit,
                                                                offset=offset)
        return result