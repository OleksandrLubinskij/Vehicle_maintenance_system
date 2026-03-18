from fastapi import FastAPI, Depends, HTTPException
from enum import Enum
from sqlalchemy import select
from sqlalchemy.orm import Session
from models import Car, User, Maintenance_log
from get_db import get_db
from schemas import CarModel, UserModel, MaintainenceLogModel, CarUpdate

app = FastAPI()

#vehicles
@app.get("/vms/get_cars")
async def get_cars(db: Session = Depends(get_db)):
    stmt = select(Car)
    res = db.execute(stmt).scalars().all()
    return res

@app.get("/vms/get_car_by_id/{car_id}")
async def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    stmt = select(Car).where(Car.id == car_id)

    res = db.execute(stmt) 

    cars = res.scalar_one_or_none()
    return cars 

@app.post("/vms/create_car")
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
        raise HTTPException(status_code=400, detail=f"Помилка бази даних {str(e)}")

@app.patch("/vms/edit_car/{car_id}")
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

@app.delete("/vms/delete_car/{car_id}")
async def delete_car(car_id:int, db: Session = Depends(get_db)):
    car_to_delete = db.get(Car, car_id)
    if not car_to_delete:
        raise HTTPException(status_code=404, detail="Машину не знайено")
    db.delete(car_to_delete)
    db.commit()

#users
@app.post("/vms/create_user")
async def create_user(user:UserModel, db: Session = Depends(get_db)):
    new_user_dict = user.model_dump()
    new_user = User(**new_user_dict)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user_dict
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Помилка бази даних {str(e)}")
