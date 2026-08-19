from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import load_only
from typing import Generic, TypeVar, Type, Any

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, db: AsyncSession, model: Type[ModelType]):
        self.db = db
        self.model = model

    async def get_all(self, 
                      limit: int | None = None,
                      offset: int | None = None) -> list[ModelType]:
        stmt = select(self.model).limit(limit).offset(offset)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
    
    async def get_by_id(self, id:int, fields: list[str] | None = None) -> ModelType | None:
        stmt = select(self.model).where(self.model.id == id)
        if fields:
            colums_to_load = [getattr(self.model, field)
                              for field in fields 
                              if hasattr(self.model, field)]
            
            if colums_to_load:
                stmt = stmt.options(load_only(*colums_to_load))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def add(self, instance: ModelType) -> ModelType:
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, id, new_data: dict[str, Any]) -> ModelType | None:
        instance = await self.get_by_id(id)
        if not instance:
            return None
        
        for key, val in new_data.items():
            setattr(instance, key, val)
        return instance
    
    async def delete(self, id: int) -> bool:
        instance = await self.get_by_id(id)
        if not instance:
            return False
        
        await self.db.delete(instance)
        return True
    
    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model)
        result = await self.db.scalar(stmt)
        return result or 0