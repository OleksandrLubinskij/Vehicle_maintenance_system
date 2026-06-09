from fastapi import Depends, APIRouter, Query
import app.enums as enums

router = APIRouter()

@router.get("/{enum_id}")
async def get_fuel_type_enum(enum_id: int):
    enums_mapping = {
        0: enums.UserRole,
        1: enums.FuelType,
        2: enums.OilType,
        3: enums.MaintenanceType,
        
    }
    obj = enums_mapping[enum_id]
    return [
        {"id": item.name,
         "name": item.value}
         for item in obj
    ]