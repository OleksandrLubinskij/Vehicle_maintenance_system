from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.enums import MaintenanceType
from app.models import MaintenanceLog
from crud.base_repository import BaseRepository

class MaintenanceLogRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, MaintenanceLog)

    async def getLastMaintenances(self, car_id):
        subq = (
        select(
            MaintenanceLog,
            func.row_number().over(
                partition_by=MaintenanceLog.maintenance_type,
                order_by=MaintenanceLog.date.desc()
            ).label("rn")
        ).where(
            MaintenanceLog.car_id == car_id,
            MaintenanceLog.maintenance_type.in_([
                MaintenanceType.Oil_and_filters, 
                MaintenanceType.Belt_replacement,
                MaintenanceType.Inspection
            ])
        )
    ).subquery()

        stmt = select(subq).where(subq.c.rn == 1)
        result = await self.db.execute(stmt)
        return result.all()