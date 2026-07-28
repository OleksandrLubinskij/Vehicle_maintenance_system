from fastapi import Depends, APIRouter, HTTPException, status
from api.v1.auth.dependencies import RoleChecker
from services.fuel_logs.fabric_fuel_log import get_fuel_log_service
from services.fuel_logs.fuel_logs_service import FuelLogService
from app.schemas import RefuelCarModel
from services.car_refuel_facade.car_refuel_facade import CarRefuelFacade
from services.car_refuel_facade.fabric_car_refuel_facade import get_car_refuel_facade
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
async def create_fuel_log(car_id: int, fuel_log_data: RefuelCarModel, car_refuel_facade: CarRefuelFacade = Depends(get_car_refuel_facade)):
    result = await car_refuel_facade.refuel_car(car_id, fuel_log_data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Попереднє значення пробігу, не може бути більшим за нове!")