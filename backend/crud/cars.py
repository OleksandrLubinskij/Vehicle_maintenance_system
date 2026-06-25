from typing import Dict
from fastapi import Depends, APIRouter
from services.car_indicators_service import get_serivce_indicators
from app.schemas import CarModel, CarResponse, CarUpdate
from app.models import Car, User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.exceptions import DBErrors, RecordNotFoundError
from app.cache.redis import RedisCache
from app.config import CACHE
from api.v1.auth.dependencies import RoleChecker

cache = RedisCache()
router = APIRouter()
allow_admin_only = RoleChecker(["Admin"])

@router.get("/", response_model= Dict[int, CarResponse])
async def get_cars(db: AsyncSession = Depends(get_db)):
    cars_cached = await cache.get_all_cached(CACHE.CARS)
    total_in_db = await db.scalar(select(func.count()).select_from(Car))
    if cars_cached and total_in_db == len(cars_cached):
        return cars_cached

    stmt = select(Car)
    cars = (await db.execute(stmt)).scalars().all()
    res = {}
    for car in cars:
        indicators = await get_serivce_indicators(car.id, car.mileage,  db)
        responce_car = CarResponse.model_validate(car)
        responce_car.service_indicators = indicators
        res[car.id] = (responce_car)
        await cache.hset(CACHE.CARS, car.id, responce_car.model_dump())
    return res

@router.get("/get_car_by_id/{car_id}", response_model= CarResponse)
async def get_car_by_id(car_id: int, 
                        db: AsyncSession = Depends(get_db)):
    car = await cache.hget_by_id(CACHE.CARS, car_id)
    if car:
        return car
    stmt = select(Car).where(Car.id == car_id)

    car = (await db.execute(stmt)).scalar_one_or_none()
    indicators = await get_serivce_indicators(car.id, car.mileage,  db)
    responce_car = CarResponse.model_validate(car)
    responce_car.service_indicators = indicators
    await cache.hset(CACHE.CARS, car.id, responce_car.model_dump())
    return responce_car

@router.get("/get_car_mileage/{car_id}")
async def get_car_mileage(car_id: int, 
                          db: AsyncSession = Depends(get_db)):
    stmt = select(Car.mileage).where(Car.id == car_id)
    mileage = (await db.execute(stmt)).scalar_one_or_none()
    return mileage

@router.get("/get_car_brand_and_model/{car_id}")
async def get_car_brand_and_model(car_id: int, 
                                  db: AsyncSession = Depends(get_db)):
    stmt = select(Car.brand, Car.model).where(Car.id == car_id)
    car = (await db.execute(stmt)).first()
    return car._asdict()

@router.post("/create_car")
async def create_car(car:CarModel, 
                     db: AsyncSession = Depends(get_db), 
                     current_user: User = Depends(allow_admin_only)):
    new_car_dict = car.model_dump()
    new_car = Car(**new_car_dict)
    try:
        db.add(new_car)
        await db.commit()
        await db.refresh(new_car)
        return new_car_dict
    except Exception as e:
        await db.rollback()
        print(e)
        raise DBErrors()

@router.patch("/edit_car/{car_id}")
async def edit_car(car:CarUpdate, 
             car_id:int, 
             db:AsyncSession = Depends(get_db),
             current_user: User = Depends(allow_admin_only)
             ):
    stmt = select(Car).where(Car.id == car_id)
    car_db = (await db.execute(stmt)).scalar()
    if not car_db:
        raise RecordNotFoundError()
    
    update_data = car.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(car_db, key, value)
    
    await db.commit()
    await db.refresh(car_db)
    await cache.delete(CACHE.CARS)
    return car_db

@router.delete("/delete_car/{car_id}")
async def delete_car(car_id:int, 
                     db: AsyncSession = Depends(get_db),
                     current_user: User = Depends(allow_admin_only)):
    car_to_delete = db.get(Car, car_id)
    if not car_to_delete:
        raise RecordNotFoundError()
    db.delete(car_to_delete)
    await db.commit()
    await cache.delete(CACHE.CARS)