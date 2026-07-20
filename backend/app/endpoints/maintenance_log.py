from app.schemas import MaintainenceLogModel, MaintainenceLogUpdate
from fastapi import Depends, APIRouter
from api.v1.auth.dependencies import RoleChecker
from services.maintenance_logs.fabric_maintenance_log_service import get_maintenance_log_service
from services.maintenance_logs.maintenance_log_service import MaintenanceLogService

router = APIRouter()
allow_admin_only = RoleChecker(["Admin"])

@router.get("/")
async def read_all_maintenance_logs(maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    maintenance_data = await maintenance_log_service.fetch_all()
    return maintenance_data

@router.get("/{id}")
async def read_maintenance_log(id: int, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    return await maintenance_log_service.fetch_by_id(id)

@router.post("/{car_id}")
async def create_maintenance_log(car_id:int, car_data: MaintainenceLogModel, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
    await maintenance_log_service.register(car_id, car_data)
    

@router.patch("/{id}")
async def edit_maintenance_log(id: int, car_new_data: MaintainenceLogUpdate, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
     await maintenance_log_service.update(id=id, new_data=car_new_data)

@router.delete("/{id}")
async def delete_maintenance_log(id:int, maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service)):
     await maintenance_log_service.remove(id)