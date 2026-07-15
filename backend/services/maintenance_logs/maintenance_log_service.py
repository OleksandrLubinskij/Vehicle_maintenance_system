from app.cache.redis import RedisCache
from app.models import MaintenanceLog
from services.base_service import BaseCRUDService
from crud.maintenane_logs_db import MaintenanceLogRepository


class MaintenanceLogService(BaseCRUDService):
    def __init__(self, repo):
        super().__init__(repo)
    
    # async def fetch_all_maintenance_logs(self) -> list[MaintenanceLog]:
    #     pass
    
    # async def fetch_maintenance_log_by_id(self, id:int) -> MaintenanceLog:
    #     pass

    # async def register_maintenance_log(self) -> MaintenanceLog:
    #     pass

    # async def update_maintenance_log(self) -> MaintenanceLog | None:
    #     pass

    # async def remove_maintnance_log(self) -> bool:
    #     pass