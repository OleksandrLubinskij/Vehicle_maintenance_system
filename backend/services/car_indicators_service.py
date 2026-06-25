from datetime import datetime
from app.models import Maintenance_log
from app.enums import MaintenanceType
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.config import LIMITATIONS, TEXT_INDICATORS
async def calculate_maintenance_delta(car_id: int, 
                                current_mileage:int,  
                                db: AsyncSession):
    subq = (
        select(
            Maintenance_log,
            func.row_number().over(
                partition_by=Maintenance_log.maintenance_type,
                order_by=Maintenance_log.date.desc()
            ).label("rn")
        ).where(
            Maintenance_log.car_id == car_id,
            Maintenance_log.maintenance_type.in_([
                MaintenanceType.Oil_and_filters, 
                MaintenanceType.Belt_replacement,
                MaintenanceType.Inspection
            ])
        )
    ).subquery()

    stmt = select(subq).where(subq.c.rn == 1)
    res = (await db.execute(stmt)).all()
    data = {
        "Oil_filters_mileage": None,
        "Belt_mileage": None,
        "Inspection_mileage": None,
        "Inspection_date": None   
    }
    for row in res:
        if row.maintenance_type == MaintenanceType.Oil_and_filters:
            data["Oil_filters_mileage"] = row.mileage_on_maintain
        
        elif row.maintenance_type == MaintenanceType.Belt_replacement:
            data["Belt_mileage"] = row.mileage_on_maintain
        
        elif row.maintenance_type == MaintenanceType.Inspection:
            data["Inspection_mileage"] = row.mileage_on_maintain
            data["Inspection_date"] = row.date

    oil_and_filters_mileage_diff = belt_replacement_mileage_diff = inspection_mileage_diff = time_diff = -1 
    if data["Inspection_date"]:
        time_now = datetime.now(data["Inspection_date"].tzinfo)
        time_diff = (time_now - data["Inspection_date"]).days
    if data["Oil_filters_mileage"] is not None:
        oil_and_filters_mileage_diff = current_mileage - data["Oil_filters_mileage"]
    if data["Belt_mileage"] is not None:
        belt_replacement_mileage_diff = current_mileage - data["Belt_mileage"]
    if data["Inspection_mileage"] is not None:
        inspection_mileage_diff = current_mileage - data["Inspection_mileage"]
    
    return (oil_and_filters_mileage_diff, belt_replacement_mileage_diff, inspection_mileage_diff, time_diff)

def evaluate_status(diff, limit):
    ratio = diff / limit
    if ratio >= 1: return 4 #overdue
    if ratio >= 0.85: return 3 #critical
    if ratio >= 0.5: return 2 #soon
    if ratio >= 0: return 1 #ok
    return 0 #none

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

