from typing import Dict
from app.schemas import CarResponce, CarModel, CarUpdate
from fastapi import Depends, APIRouter
from api.v1.auth.dependencies import RoleChecker
from services.cars.fabric_car_service import get_vehicle_service
from services.cars.car_service import VehicleService
from services.dashboard_facade import DashboardFacade

router = APIRouter()
allow_admin_only = RoleChecker(["Admin"])

# @router.get("/", response_model=Dict[int, CarResponce])
@router.get("/")
async def read_all_cars(vehicle_service: VehicleService = Depends(get_vehicle_service),
                        dashboard_facade: DashboardFacade = Depends()):
    car_data = await vehicle_service.fetchVehicles()
    res = {}
    car_id_list = []
    for car in car_data:
         res[car.id] = car
         car_id_list.append(car.id)
    result = await dashboard_facade.compile_car_and_car_indicators(car_data, car_id_list)
    return result

@router.get("/{id}")
async def read_car(id: int, 
                   vehicle_service: VehicleService = Depends(get_vehicle_service),
                   dashboard_facade: DashboardFacade = Depends()):
    car = await vehicle_service.fetch_by_id(id)
    return await dashboard_facade.compile_car_and_car_indicators([car], [id])

@router.post("/")
async def create_car(car_data: CarModel, vehicle_service: VehicleService = Depends(get_vehicle_service)):
    await vehicle_service.register(car_data)

@router.patch("/{id}")
async def edit_car(id: int, car_new_data: CarUpdate, vehicle_service: VehicleService = Depends(get_vehicle_service)):
     await vehicle_service.update(id=id, new_data=car_new_data)

@router.delete("/{id}")
async def delete_car(id:int, vehicle_service: VehicleService = Depends(get_vehicle_service)):
     await vehicle_service.remove(id)