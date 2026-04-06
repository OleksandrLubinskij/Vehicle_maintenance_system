from pydantic import BaseModel, ConfigDict
from enums import FuelType, OilType, UserRole, MaintenanceType
from typing import Optional, Dict
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

class MaintainenceLogBaseModel(BaseModel):
    car_id: int
    mileage_on_maintain: int
class MaintainenceLogModel(MaintainenceLogBaseModel):
    maintenance_type: MaintenanceType
    description: str
class CarUpdate(BaseModel):
    vin: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    mileage: Optional[int] = None
    engine_capacity: Optional[float] = None
    fuel_type: Optional[FuelType] = None
    oil_type: Optional[OilType] = None


class MaintainenceLogUpdate(BaseModel):
    maintenance_type: Optional[MaintenanceType] = None
    description: Optional[str] = None

class CarResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    brand: str
    model: str
    mileage: int
    service_indicators: Dict[str, str] = {}