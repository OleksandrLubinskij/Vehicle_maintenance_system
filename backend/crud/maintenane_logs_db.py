from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.models import MaintenanceLog, Car
from app.enums import MaintenanceType
from crud.base_repository import BaseRepository

class MaintenanceLogRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, MaintenanceLog)

    async def get_last_maintenances(self, car_id_list: list):
        stmt = select(MaintenanceLog
                    ).options(
                        joinedload(MaintenanceLog.car).load_only(Car.mileage)
                    ).where(
                          MaintenanceLog.car_id.in_(car_id_list),
                          MaintenanceLog.maintenance_type.in_([
                              MaintenanceType.Belt_replacement,
                              MaintenanceType.Oil_and_filters,
                              MaintenanceType.Inspection
                          ])
                    ).distinct(
                        MaintenanceLog.car_id, MaintenanceLog.maintenance_type
                    ).order_by(
                        MaintenanceLog.car_id,
                        MaintenanceLog.maintenance_type,
                        MaintenanceLog.date.desc()
                    )

        result = (await self.db.execute(stmt)).scalars().all() 
        return result
        