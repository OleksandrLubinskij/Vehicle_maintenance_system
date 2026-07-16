from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from crud.fuel_log_db import FuelLogRepository
from services.fuel_logs.fuel_logs_service import FuelLogService

def get_fuel_log_repo(db: AsyncSession = Depends(get_db)) -> FuelLogRepository:
    return FuelLogRepository(db=db)

def get_fuel_log_service(repo: FuelLogService = Depends(get_fuel_log_repo)) -> FuelLogService:
      return FuelLogService(repo=repo)