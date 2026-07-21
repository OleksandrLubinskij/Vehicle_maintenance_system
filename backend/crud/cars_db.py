from app.models import Car
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import load_only
from .base_repository import BaseRepository
class VehicleRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Car)

