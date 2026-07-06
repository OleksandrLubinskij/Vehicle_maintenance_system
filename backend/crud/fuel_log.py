from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import FuelLog, User
from app.database import get_db
from app.schemas import FuelLogModel
from app.cache.redis import RedisCache
from app.config import CACHE
from api.v1.auth.dependencies import RoleChecker

router = APIRouter()
async def get_fuel_logs(car_id:int, db: AsyncSession):
    stmt = select(FuelLog).where(FuelLog.car_id == car_id).order_by(desc(FuelLog.date))
    fuel_logs = (await db.execute(stmt)).scalars().all()
    return fuel_logs

async def create_fuel_log(car_id:int, fuel_log_data: dict, db: AsyncSession):
    fuel_log = FuelLog(car_id=car_id, **fuel_log_data)
    db.add(fuel_log)
    await db.commit()
    await db.refresh(fuel_log)
    return fuel_log

@router.get("/get_fuel_logs/{car_id}")
async def get_fuel_logs_endpoint(car_id: int, db: AsyncSession = Depends(get_db)):
    try:
        fuel_logs = await get_fuel_logs(car_id, db)
        return fuel_logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/create_fuel_log/{car_id}")
async def create_fuel_log_endpoint(car_id: int, fuel_log_data: FuelLogModel, db: AsyncSession = Depends(get_db), current_user: User = Depends(RoleChecker(["Admin"]))):
    try:
        fuel_log_data = fuel_log_data.model_dump()
        fuel_log = await create_fuel_log(car_id, fuel_log_data, db)
        return fuel_log
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))