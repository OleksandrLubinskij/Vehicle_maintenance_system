from typing import Dict
from app.schemas import CarResponce, CarModel, CarUpdate
from fastapi import Depends, APIRouter
from api.v1.auth.dependencies import RoleChecker
from app.cache.redis import RedisCache, get_redis_cache
from app.database import get_db
from crud.cars_db import VehicleRepository
from services.cars.car_service import VehicleService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
allow_admin_only = RoleChecker(["Admin"])

def get_vehicle_repo(db: AsyncSession = Depends(get_db)) -> VehicleRepository:
    return VehicleRepository(db=db)

def get_vehicle_service(cache: RedisCache = Depends(get_redis_cache),
                        repo: VehicleRepository = Depends(get_vehicle_repo)) -> VehicleService:
      return VehicleService(cache=cache, repo=repo)

@router.get("/", response_model=Dict[int, CarResponce])
async def read_all_cars(vehicle_service: VehicleService = Depends(get_vehicle_service)):
    car_data = await vehicle_service.fetchVehicles()
    res = {}
    for car in car_data:
         res[car.id] = car
    return res

@router.get("/{id}")
async def read_car(id: int, vehicle_service: VehicleService = Depends(get_vehicle_service)):
    return await vehicle_service.fetch_by_id(id)

@router.post("/")
async def create_car(car_data: CarModel, vehicle_service: VehicleService = Depends(get_vehicle_service)):
    await vehicle_service.register(car_data)

@router.patch("/{id}")
async def edit_car(id: int, car_new_data: CarUpdate, vehicle_service: VehicleService = Depends(get_vehicle_service)):
     await vehicle_service.update(id=id, new_data=car_new_data)

@router.delete("/{id}")
async def delete_car(id:int, vehicle_service: VehicleService = Depends(get_vehicle_service)):
     await vehicle_service.remove(id)

# @router.get("/indicators/{car_id}")
# async def get_serivce_indicators(car_id: int,  
#                             db: AsyncSession):
#         diffs = await calculate_maintenance_delta(car_id, current_mileage, db)

#         output =  {
#             key: evaluate_status(diff, LIMITATIONS[key])
#             for key, diff in zip(LIMITATIONS.keys(), diffs)
#         }
#         worst_maintenance_code = max(output.values())
#         output["worst_maintenance"] = worst_maintenance_code
#         output["text_indicator"] = TEXT_INDICATORS[worst_maintenance_code]
#         inspection_mileage = output.pop("inspection_mileage")
#         inspection_time = output.pop("inspection_time")
#         output["inspection"] = max((inspection_mileage, inspection_time))
#         return output