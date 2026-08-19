from sqlalchemy import select, asc, desc
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

        result = await self.db.execute(stmt)
        return result.scalars().all() 

    async def get_maintenance_logs_by_car_id(self,
                                             car_id: int,
                                             maintenance_type: str | None = None,
                                             sort_order: str | None = None, 
                                             limit: int = 10,
                                             offset: int = 0):
        conditions = [MaintenanceLog.car_id == car_id]
        if maintenance_type is not None:
            conditions.append(MaintenanceLog.maintenance_type == maintenance_type)
        sort_order_condition = asc(MaintenanceLog.date) if sort_order == "asc" else desc(MaintenanceLog.date)

        stmt = select(MaintenanceLog
                      ).where(
                          *conditions
                      ).order_by(
                          sort_order_condition
                      ).limit(
                          limit
                      ).offset(
                          offset
                      )
        result = await self.db.execute(stmt)
        return result.scalars().all()