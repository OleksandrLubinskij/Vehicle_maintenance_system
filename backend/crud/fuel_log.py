import calendar
from datetime import date

from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy import desc, select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import FuelLog, User
from app.database import get_db
from app.schemas import FuelLogModel, CarUpdate
from api.v1.auth.dependencies import RoleChecker
from .cars_db import get_mileage, edit_car_db

router = APIRouter()
async def get_fuel_logs(
        car_id:int, 
        db: AsyncSession,
        limit: int = 10,
        offset: int = 0
    ):
    stmt = select(
        FuelLog
        ).where(
            FuelLog.car_id == car_id
        ).order_by(desc(FuelLog.date)
        ).limit(limit).offset(offset)
    
    fuel_logs = (await db.execute(stmt)).scalars().all()
    return fuel_logs

async def create_fuel_log(
        car_id:int, 
        fuel_log_data: dict, 
        db: AsyncSession
    ):
    fuel_log = FuelLog(car_id=car_id, **fuel_log_data)
    db.add(fuel_log)
    await db.commit()
    await db.refresh(fuel_log)
    return fuel_log

async def get_monthly_fuel_consumption(car_id, db, target_date: date = None):
    if target_date is None:
        target_date = date.today()
    first_day = target_date.replace(day=1)
    _, days_in_month = calendar.monthrange(target_date.year, target_date.month)
    last_day = target_date.replace(day=days_in_month)

    stmt = (
        select(func.sum(FuelLog.liters))
        .where(FuelLog.car_id == car_id)
        .where(FuelLog.date >= first_day)
        .where(FuelLog.date <= last_day)
    )
    
    total_fuel = await db.scalar(stmt)
    
    return total_fuel or 0.0

@router.get("/get_fuel_logs/{car_id}")
async def get_fuel_logs_endpoint(
            car_id: int, 
            db: AsyncSession = Depends(get_db),
            limit: int = 10,
            offset: int = 0,
        ):
    try:
        fuel_logs = await get_fuel_logs(car_id, db, limit, offset)
        return fuel_logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/create_fuel_log/{car_id}")
async def create_fuel_log_endpoint(
            car_id: int, 
            fuel_log_data: FuelLogModel, 
            db: AsyncSession = Depends(get_db), 
            current_user: User = Depends(RoleChecker(["Admin"]))
        ):
    try:
        current_mileage = await get_mileage(car_id, db)
        if fuel_log_data.current_mileage < current_mileage:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пробіг який ви ввели, не може бути меншим за поточний пробіг автомобіля.")
        fuel_log_data = fuel_log_data.model_dump()
        fuel_log = await create_fuel_log(car_id, fuel_log_data, db)
        car_update_data = CarUpdate(**{"mileage": fuel_log_data["current_mileage"]})
        await edit_car_db(car_id, car_update_data, db)
        return fuel_log
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/monthly_fuel_consumption/{car_id}")
async def monthly_fuel_consumption_endpoint(
            car_id: int, 
            db: AsyncSession = Depends(get_db),
            target_date: date = None
        ):
    try:
        total_fuel = await get_monthly_fuel_consumption(car_id, db, target_date)
        return {"total_fuel": total_fuel}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))