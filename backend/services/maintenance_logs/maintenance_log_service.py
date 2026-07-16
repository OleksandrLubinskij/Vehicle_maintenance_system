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
    