from fastapi import Depends
from services.car_refuel_facade.car_refuel_facade import CarRefuelFacade
from services.fuel_logs.fuel_logs_service import FuelLogService
from services.cars.car_service import VehicleService
from services.cars.fabric_car_service import get_vehicle_service
from services.fuel_logs.fabric_fuel_log import get_fuel_log_service

def get_car_refuel_facade(vehicle_service: VehicleService = Depends(get_vehicle_service),
                          fuel_log_service: FuelLogService = Depends(get_fuel_log_service)) -> CarRefuelFacade:
      return CarRefuelFacade(vehicle_service=vehicle_service,
                             fuel_log_service=fuel_log_service)