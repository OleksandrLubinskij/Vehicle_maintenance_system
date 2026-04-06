from fastapi import FastAPI, Depends, HTTPException
from enum import Enum
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from models import Car, User, Maintenance_log
from get_db import get_db
from schemas import CarModel, UserModel, MaintainenceLogModel, CarUpdate, MaintainenceLogUpdate, CarResponse
from datetime import datetime, timezone
from enums import MaintenanceType, ServiceStatus
from typing import List

app = FastAPI()

def calculate_maintenance_delta(car_id: int, db: Session):
    car = db.get(Car, car_id)
    if not car:
        return None

    current_mileage = car.mileage

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
    res = db.execute(stmt).all()
    print(res)
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

    # oil_and_filters_mileage_diff = current_mileage - data["Oil_filters_mileage"] if data["Oil_filters_mileage"] != None else -1
    # belt_replacement_mileage_diff = current_mileage - data["Belt_mileage"] if data["Belt_mileage"] != None else -1
    # inspection_mileage_diff = current_mileage - data["Inspection_mileage"] if data["Inspection_mileage"] != None else -1
    

    return (oil_and_filters_mileage_diff, belt_replacement_mileage_diff, inspection_mileage_diff, time_diff)

def evaluate_status(diff, limit):
    ratio = diff / limit
    if ratio >= 1: return ServiceStatus.OVERDUE
    if ratio >= 0.85: return ServiceStatus.ALERT
    if ratio >= 0.5: return ServiceStatus.SOON
    if ratio >= 0: return ServiceStatus.OK
    return ServiceStatus.NO_RECORDS

def get_serivce_indicators(car_id: int, db: Session):
    limitation = {
        "oil_and_filters": 10000,
        "belt_replacement": 60000,
        "inspection_mileage": 10000,
        "inspection_time": 365
    }
    res = {}
    diffs = calculate_maintenance_delta(car_id, db)

    return {
        key: evaluate_status(diff, limitation[key])
        for key, diff in zip(limitation.keys(), diffs)
    }

#vehicles
@app.get("/vms/get_cars", response_model= List[CarResponse])
async def get_cars(db: Session = Depends(get_db)):
    stmt = select(Car)
    cars = db.execute(stmt).scalars().all()
    res = []
    for car in cars:
        indicators = get_serivce_indicators(car.id, db)
        responce_car = CarResponse.model_validate(car)
        responce_car.service_indicators = indicators
        res.append(responce_car)
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

#maintainence_log
@app.get("/vmc/get_maintainence_log/{car_id}")
async def get_maintainence_log(car_id: int, db: Session = Depends(get_db)):
    stmt = select(Maintenance_log).where(Maintenance_log.car_id == car_id).limit(10)
    res = db.execute(stmt).scalars().all()
    return res

@app.get("/vmc/get_maintainence_record_by_id/{log_id}")
async def get_maintainence_log_by_id(log_id: int, db:Session = Depends(get_db)):
    stmt = select(
        Maintenance_log
    ).where(
        Maintenance_log.id == log_id 
    )
    res = db.execute(stmt).scalar_one_or_none()
    return res

@app.post("/vmc/create_maintainence_record/{car_id}")
async def create_maintainence_record(car_id: int, log:MaintainenceLogModel, db: Session = Depends(get_db)):
    stmt = select(
        Car.mileage
        ).where(
            Car.id == car_id
        )
    car_mileage = db.execute(stmt).all()[0][0]

    new_log_dict = log.model_dump()
    new_log_dict["mileage_on_maintain"] = car_mileage
    new_log_dict["car_id"] = car_id
    new_log_obj = Maintenance_log(**new_log_dict)
    try:
        db.add(new_log_obj)
        db.commit()
        db.refresh(new_log_obj)
        return new_log_obj
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Помилка бази даних {str(e)}")
    
@app.patch("/vmc/edit_maintainence_record/{record_id}")
async def edit_maintainence_record(edited_record: MaintainenceLogUpdate, record_id: int, db: Session = Depends(get_db)):
    stmt = select(
        Maintenance_log
        ).where(
            Maintenance_log.id == record_id
        )
    
    record_obj = db.execute(stmt).scalar_one()
    if not record_obj:
        raise HTTPException(status_code=404, detail="Запис не знайдено!")
    
    edited_record = edited_record.model_dump(exclude_unset=True)

    for key, val in edited_record.items():
        setattr(record_obj, key, val)
    
    db.commit()
    db.refresh(record_obj)
    return record_obj

@app.delete("/vmc/delete_maintainence_record/{record_id}")
async def delete_maintainence_record(record_id: int, db: Session = Depends(get_db)):
    record_to_delete = db.get(Maintenance_log, record_id)
    if not record_to_delete:
        raise HTTPException(status_code=404, detail="Запис не знайдено")

    db.delete(record_to_delete)
    db.commit()