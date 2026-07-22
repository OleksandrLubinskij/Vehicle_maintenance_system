from sqlalchemy import update

from app.models import Car
from sqlalchemy.ext.asyncio import AsyncSession
from .base_repository import BaseRepository
class VehicleRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Car)

    async def update_car_photo_path(self, car_id:int, new_photo_path: str) -> str | None:
        stmt = update(Car).where(Car.id == car_id).values(photo_path = new_photo_path)
        result = await self.db.execute(stmt)
        return result
