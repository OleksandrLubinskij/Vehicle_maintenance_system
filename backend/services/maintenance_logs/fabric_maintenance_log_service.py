from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from crud.maintenane_logs_db import MaintenanceLogRepository
from services.maintenance_logs.maintenance_log_service import MaintenanceLogService


def get_maintenance_log_repo(db: AsyncSession = Depends(get_db)) -> MaintenanceLogRepository:
    return MaintenanceLogRepository(db=db)

def get_maintenance_log_service(repo: MaintenanceLogRepository = Depends(get_maintenance_log_repo)) -> MaintenanceLogService:
      return MaintenanceLogService(repo=repo)