from datetime import datetime
from app.enums import MaintenanceType
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import LIMITATIONS, TEXT_INDICATORS

def evaluate_status(diff, limit):
    ratio = diff / limit
    if ratio >= 1: return 4 #overdue
    if ratio >= 0.85: return 3 #critical
    if ratio >= 0.5: return 2 #soon
    if ratio >= 0 or ratio < 0: return 1 #ok


def process_car_maintenance_indicators(car_maintenance_indicators: dict) -> dict:
    worst_maintenance_code = max(car_maintenance_indicators.values())
    car_maintenance_indicators["worst_maintenance"] = worst_maintenance_code
    car_maintenance_indicators["text_indicator"] = TEXT_INDICATORS[worst_maintenance_code]
    inspection_mileage = car_maintenance_indicators.pop("Inspection_mileage")
    inspection_time = car_maintenance_indicators.pop("Inspection_date")
    car_maintenance_indicators["inspection"] = max((inspection_mileage, inspection_time))
    return car_maintenance_indicators

async def calculate_maintenance_delta(last_maintenances: list, car_id_list: list) -> dict:
    maintenance_delta = {
        car_id: {
            "Oil_filters_mileage": 0,
            "Belt_mileage": 0,
            "Inspection_mileage": 0,
            "Inspection_date": 0   
        } for car_id in car_id_list
    }

    for row in last_maintenances:
        car_id = row.car.id
        if car_id not in maintenance_delta:
            maintenance_delta[car_id] = {
                "Oil_filters_mileage": 0,
                "Belt_mileage": 0,
                "Inspection_mileage": 0,
                "Inspection_date": 0
            }

        mileage_diff = row.car.mileage - row.mileage_on_maintain
        
        if row.maintenance_type == MaintenanceType.Oil_and_filters:
            maintenance_delta[car_id]["Oil_filters_mileage"] = evaluate_status(
                mileage_diff, 
                LIMITATIONS.oil_and_filters
            )
        
        elif row.maintenance_type == MaintenanceType.Belt_replacement:
            maintenance_delta[car_id]["Belt_mileage"] = evaluate_status(
                mileage_diff, 
                LIMITATIONS.belt_replacement
            )
        
        elif row.maintenance_type == MaintenanceType.Inspection:
            maintenance_delta[car_id]["Inspection_mileage"] = evaluate_status(
                mileage_diff, 
                LIMITATIONS.inspection_mileage
            )
            
            time_now = datetime.now(row.date.tzinfo)
            maintenance_delta[car_id]["Inspection_date"] = evaluate_status(
                ((time_now - row.date).days), 
                LIMITATIONS.inspection_time
            )
            
    return maintenance_delta

async def get_serivce_indicators(car_id: int, 
                           current_mileage: int,  
                           db: AsyncSession):
    diffs = await calculate_maintenance_delta(car_id, current_mileage, db)

    output =  {
        key: evaluate_status(diff, LIMITATIONS[key])
        for key, diff in zip(LIMITATIONS.keys(), diffs)
    }
    worst_maintenance_code = max(output.values())
    output["worst_maintenance"] = worst_maintenance_code
    output["text_indicator"] = TEXT_INDICATORS[worst_maintenance_code]
    inspection_mileage = output.pop("inspection_mileage")
    inspection_time = output.pop("inspection_time")
    output["inspection"] = max((inspection_mileage, inspection_time))
    return output

