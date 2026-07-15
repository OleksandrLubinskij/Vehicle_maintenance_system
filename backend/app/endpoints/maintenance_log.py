from typing import Dict
from app.schemas import MaintainenceLogModel, MaintainenceLogUpdate
from fastapi import Depends, APIRouter
from api.v1.auth.dependencies import RoleChecker
from app.database import get_db
from services.maintenance_logs.maintenance_log_service import MaintenanceLogService
from crud.maintenane_logs_db import MaintenanceLogRepository
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
allow_admin_only = RoleChecker(["Admin"])

def get_maintenance_log_repo(db: AsyncSession = Depends(get_db)) -> MaintenanceLogRepository:
    return MaintenanceLogRepository(db=db)

def get_maintenance_log_service(repo: MaintenanceLogRepository = Depends(get_maintenance_log_repo)) -> MaintenanceLogService:
      return MaintenanceLogService(repo=repo)

@router.get("/")
async def read_all_maintenance_logs(maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    maintenance_data = await maintenance_log_service.fetch_all()
    return maintenance_data

@router.get("/{id}")
async def read_maintenance_log(id: int, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    return await maintenance_log_service.fetch_by_id(id)

@router.post("/")
async def create_maintenance_log(car_data: MaintainenceLogModel, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    await maintenance_log_service.register(car_data)

@router.patch("/{id}")
async def edit_maintenance_log(id: int, car_new_data: MaintainenceLogUpdate, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
     await maintenance_log_service.update(id=id, new_data=car_new_data)

@router.delete("/{id}")
async def delete_maintenance_log(id:int, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
     await maintenance_log_service.remove(id)