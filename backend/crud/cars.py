from typing import List
from fastapi import Depends, HTTPException, APIRouter
from services.car_indicators_service import get_serivce_indicators
from app.schemas import CarModel, CarResponse, CarUpdate
from app.models import Car
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.exceptions import DBErrors, RecordNotFoundError
from app.cache.redis import RedisCache

cache = RedisCache()

router = APIRouter()

@router.get("/", response_model= List[CarResponse])
async def get_cars(db: Session = Depends(get_db)):
    cars = cache.get("cars")
    print("jhgfjhgfjghf")
    if cars:
        print("У кеші")
        return cars
    
    stmt = select(Car)
    cars = db.execute(stmt).scalars().all()
    res = []
    for car in cars:
        indicators = get_serivce_indicators(car.id, car.mileage,  db)
        responce_car = CarResponse.model_validate(car)
        responce_car.service_indicators = indicators
        res.append(responce_car)
    data_for_cache = [car.model_dump() for car in res]
    cache.set("cars", data_for_cache)
    
    return res

@router.get("/get_car_by_id/{car_id}")
async def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    stmt = select(Car).where(Car.id == car_id)

    res = db.execute(stmt) 

    cars = res.scalar_one_or_none()
    return cars 

@router.post("/create_car")
async def create_car(car:CarModel, db: Session = Depends(get_db)):
    new_car_dict = car.model_dump()
    new_car = Car(**new_car_dict)
    try:
        db.add(new_car)
        db.commit()
        db.refresh(new_car)
        return new_car_dict
    except Exception as e:
        db.rollback()
        print(e)
        raise DBErrors()

@router.patch("/edit_car/{car_id}")
def edit_car(car:CarUpdate, car_id:int, db:Session = Depends(get_db)):
    stmt = select(Car).where(Car.id == car_id)
    car_db = db.execute(stmt).scalar()
    if not car_db:
        raise HTTPException(status_code=404, detail="Машину не знайдено")
    
    update_data = car.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(car_db, key, value)
    
    db.commit()
    db.refresh(car_db)
    return car_db

@router.delete("/delete_car/{car_id}")
async def delete_car(car_id:int, db: Session = Depends(get_db)):
    car_to_delete = db.get(Car, car_id)
    if not car_to_delete:
        raise HTTPException(status_code=404, detail="Машину не знайено")
    db.delete(car_to_delete)
    db.commit()