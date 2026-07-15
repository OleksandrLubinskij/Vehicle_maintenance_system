from datetime import date

from app.models import FuelLog
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from sqlalchemy.orm import load_only
from .base_repository import BaseRepository

class FuelLogRepository(BaseRepository[FuelLog]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, FuelLog)

    async def get_all(self, 
                      limit: int | None = None,
                      offset: int | None = None) -> list[FuelLog]:
        stmt = select(self.model
                    ).order_by(self.model.date.desc()
                    ).limit(limit
                    ).offset(offset)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_total_fuel_in_range(self,
                                      car_id: int,
                                      start_date: date,
                                      end_date: date)-> float:
        stmt = select(func.sum(self.model.liters)
        ).where(self.model.car_id == car_id
        ).where(self.model.date >= start_date
        ).where(self.model.date <= end_date)

        result = await self.db.scalar(stmt)
        return result or 0.0