from typing import Generic, TypeVar, Type, Any
from pydantic import BaseModel
from fastapi import HTTPException, status

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel) 
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel) 

class BaseCRUDService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, repo: Any):
        self.repo = repo

    async def fetch_all(self) -> list[ModelType]:
        instance = await self.repo.get_all()
        return instance
    
    async def fetch_by_id(self, id:int) -> ModelType:
        instance = await self.repo.get_by_id(id=id)
        if instance is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Not found!")
        return instance
    
    async def register(self, new_data: CreateSchemaType) -> ModelType:
        data = new_data.model_dump()
        instance = ModelType(**data)
        await self.repo.add(instance)
        
    async def update(self, id:int, new_data:UpdateSchemaType) -> ModelType:
        data = new_data.model_dump()
        result = await self.repo.update(id, data)
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Not found!") 
        
    async def remove(self, id:int) -> bool:
        result = await self.repo.delete(id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Not found")