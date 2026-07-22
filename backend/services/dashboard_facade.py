from app.models import Car
from services.fuel_logs.fuel_logs_service import FuelLogService
from services.maintenance_logs.maintenance_log_service import MaintenanceLogService
from services.cars.car_service import VehicleService
from services.cars.fabric_car_service import get_vehicle_service
from services.maintenance_logs.fabric_maintenance_log_service import get_maintenance_log_service
from services.fuel_logs.fabric_fuel_log import get_fuel_log_service
from fastapi import Depends
from services.cars.car_indicators_service import calculate_maintenance_delta, process_car_maintenance_indicators
class DashboardFacade:
    def __init__(self,
                 vehicle_service: VehicleService = Depends(get_vehicle_service),
                 maintenance_log_service: MaintenanceLogService = Depends(get_maintenance_log_service),
                 fuel_log_service: FuelLogService = Depends(get_fuel_log_service)
                 ):
        self.vehicle_service = vehicle_service
        self.maintenance_log_service = maintenance_log_service
        self.fuel_log_service = fuel_log_service


    async def get_car_indicators(self, car_id_list: list[int]):
        records = await self.maintenance_log_service.fetch_last_maintenance_logs(car_id_list)
        maintenance_delta = await calculate_maintenance_delta(records, car_id_list)
        for key, car_maintenance_indicators in maintenance_delta.items():
            process_record = process_car_maintenance_indicators(car_maintenance_indicators)
            maintenance_delta[key] = process_record
        
        return maintenance_delta
    
    async def compile_car_and_car_indicators(self, cars: list[Car], car_id_list: list[int]):
        maintenance_delta = await self.get_car_indicators(car_id_list)
        fuel_monthly_consumption = await self.fuel_log_service.get_monthly_fuel_consumption(car_id_list)
        result = {}
        for car in cars:
            car_data = {
                "id": car.id,
                "vin": car.vin,
                "brand": car.brand,
                "model": car.model, 
                "mileage": car.mileage,
                "engine_capacity": car.engine_capacity,
                "fuel_type": car.fuel_type,
                "oil_type": car.oil_type,
                "photo_path": car.photo_path,
                "service_indicators": maintenance_delta.get(car.id, {}),
                "monthly_fuel_consumption": fuel_monthly_consumption.get(car.id, 0.0)
            }
            result[car.id] = car_data
        return result