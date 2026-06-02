from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Car, Maintenance_log
from app.database import get_db
from app.schemas import MaintainenceLogModel, MaintainenceLogUpdate


router = APIRouter()

@router.get("/{car_id}")
async def get_maintainence_log(car_id: int, db: Session = Depends(get_db)):
    stmt = select(Maintenance_log).where(Maintenance_log.car_id == car_id).limit(10)
    res = db.execute(stmt).scalars().all()
    return res

@router.get("/get_maintenance_record_by_id/{log_id}")
async def get_maintainence_log_by_id(log_id: int, db:Session = Depends(get_db)):
    stmt = select(
        Maintenance_log
    ).where(
        Maintenance_log.id == log_id 
    )
    res = db.execute(stmt).scalar_one_or_none()
    return res

@router.post("/create_maintenance_record/{car_id}")
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
    
@router.patch("/edit_maintenance_record/{record_id}")
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

@router.delete("/delete_maintenance_record/{record_id}")
async def delete_maintainence_record(record_id: int, db: Session = Depends(get_db)):
    record_to_delete = db.get(Maintenance_log, record_id)
    if not record_to_delete:
        raise HTTPException(status_code=404, detail="Запис не знайдено")

    db.delete(record_to_delete)
    db.commit()