from fastapi import Depends, APIRouter
from api.v1.auth.dependencies import RoleChecker
from services.cars.fabric_car_service import get_vehicle_service
from services.fuel_logs.fabric_fuel_log import get_fuel_log_service
from services.fuel_logs.fuel_logs_service import FuelLogService
from app.schemas import FuelLogModel
router = APIRouter()

@router.get("/")
async def read_all_fuel_log(fuel_log_service: FuelLogService = Depends(get_fuel_log_service)):
    result = await fuel_log_service.fetch_all()
    return result



@router.get("/{id}")
async def read_fuel_log(id: int, fuel_log_service: FuelLogService = Depends(get_fuel_log_service)):
    result = await fuel_log_service.fetch_by_id(id)
    return result

@router.post("/{car_id}")
async def create_fuel_log(car_id: int, fuel_log_data: FuelLogModel, fuel_log_service: FuelLogService = Depends(get_fuel_log_service)):
    await fuel_log_service.register(car_id, fuel_log_data)