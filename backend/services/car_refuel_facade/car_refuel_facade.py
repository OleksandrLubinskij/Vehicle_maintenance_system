from app.models import Car
from services.fuel_logs.fuel_logs_service import FuelLogService
from services.cars.car_service import VehicleService
from app.schemas import RefuelCarModel
from app.schemas import CarUpdate

class CarRefuelFacade():
    def __init__(self,
                 vehicle_service: VehicleService,
                 fuel_log_service: FuelLogService):
        self.vehicle_service = vehicle_service
        self.fuel_log_service = fuel_log_service

    async def refuel_car(self, car_id: int, data:RefuelCarModel):
        car = await self.vehicle_service.fetch_by_id(car_id, ["mileage"])
        print(data.current_mileage)
        if data.current_mileage < car.mileage:
            return None

        vehicle_update_data = CarUpdate(mileage=data.current_mileage)
        await self.fuel_log_service.register(car_id=car_id, new_fuel_log_data=data)
        await self.vehicle_service.update(id=car_id, new_data=vehicle_update_data)
        