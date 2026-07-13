from pydantic import BaseModel, ConfigDict
from app.enums import FuelType, OilType, UserRole, MaintenanceType
from typing import Optional, Dict, Any
class CarModel(BaseModel):
    vin: str
    brand: str
    model: str
    mileage: int
    engine_capacity: float
    fuel_type: FuelType
    oil_type: OilType

class UserCreate(BaseModel):
    login: str
    password: str

class UserLogin(BaseModel):
    login: str
    password: str

class UserResponce(BaseModel):
    login: str
    role: str
class MaintainenceLogModel(BaseModel):
    mileage_on_maintain: int
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
    mileage_on_maintain: Optional[int] = None
    maintenance_type: Optional[MaintenanceType] = None
    description: Optional[str] = None

class CarResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    vin: str
    brand: str
    model: str
    mileage: int
    engine_capacity:float
    fuel_type: str
    oil_type: str
    service_indicators: Dict[str, Any] = {}
    photo_path: str | None
    monthly_fuel_consumption: float | None = 0.0

class ResetPasssword(BaseModel):
    old_password: str
    new_password: str

class FuelLogModel(BaseModel):
    current_mileage: int
    liters: int