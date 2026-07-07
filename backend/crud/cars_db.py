from app.schemas import CarUpdate
from app.models import Car
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.exceptions import DBErrors, RecordNotFoundError
from app.cache.redis import RedisCache
from app.config import CACHE

cache = RedisCache()
async def get_mileage(car_id:int, db: AsyncSession):
    stmt = select(Car.mileage).where(Car.id == car_id)
    mileage = (await db.execute(stmt)).scalar_one_or_none()
    return mileage

async def edit_car_db(
        car_id:int, 
        car_data: CarUpdate, 
        db: AsyncSession):
    stmt = select(Car).where(Car.id == car_id)
    car_db = (await db.execute(stmt)).scalar()
    if not car_db:
        raise RecordNotFoundError()
    
    update_data = car_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(car_db, key, value)
    
    await db.commit()
    await db.refresh(car_db)
    await cache.delete(CACHE.CARS)