from pydantic import BaseModel
from enums import FuelType, OilType, UserRole, MaintenanceType
from typing import Optional
class CarModel(BaseModel):
    vin: str
    brand: str
    model: str
    mileage: int
    engine_capacity: float
    fuel_type: FuelType
    oil_type: OilType

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

class CarUpdate(BaseModel):
    vin: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    mileage: Optional[int] = None
    engine_capacity: Optional[float] = None
    fuel_type: Optional[FuelType] = None
    oil_type: Optional[OilType] = None