from datetime import date

from app.models import FuelLog
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
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
                                      car_id_list: list[int],
                                      start_date: date,
                                      end_date: date)-> dict[int, float]:
        stmt = select(self.model.car_id, func.sum(self.model.liters)
        ).where(self.model.car_id.in_(car_id_list)
        ).where(self.model.date >= start_date
        ).where(self.model.date <= end_date
        ).group_by(self.model.car_id)

        result = await self.db.execute(stmt)
        return dict(result.all())

    async def get_fuel_log_by_car_id(self,
                                     car_id: int,
                                     limit: int = 10,
                                     offset: int = 0):
        stmt = select(FuelLog
        ).where(FuelLog.car_id == car_id
        ).limit(limit
        ).offset(offset)

        result = await self.db.execute(stmt)
        return result.scalars().all()
