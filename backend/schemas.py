from pydantic import BaseModel
from enums import FuelType, OilType, UserRole, MaintenanceType
class CarModel(BaseModel):
    vin: str
    brand: str
    model: str
    mileage: int
    engine_capacity: float
    fuel_type: FuelType
    oil_type: OilType
    driver_id: int

class UserModel(BaseModel):
    firstname: str
    lastname: str
    login: str
    password: str
    role: UserRole

class MaintainenceLogModel(BaseModel):
    car_id: int
    maintenance_type: MaintenanceType
    description: str
    mileage_on_maintain: int