from typing import Generic, Type, TypeVar, Any
from pydantic import BaseModel
from app.exceptions import NotFoundError

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel) 
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel) 

class BaseCRUDService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    model: Type[ModelType]
    def __init__(self, repo: Any):
        self.repo = repo

    async def fetch_all(self) -> list[ModelType]:
        instance = await self.repo.get_all()
        return instance
    
    async def fetch_by_id(self, id:int, fields:list[str] | None = None) -> ModelType:
        instance = await self.repo.get_by_id(id=id, fields=fields)
        if instance is None:
            raise NotFoundError()
        return instance
    
    async def register(self, new_data: CreateSchemaType) -> ModelType:
        data = new_data.model_dump()
        instance = self.model(**data)
        await self.repo.add(instance)
        return instance
        
    async def update(self, id:int, new_data:UpdateSchemaType) -> ModelType:
        data = new_data.model_dump(exclude_unset=True, exclude_none=True)
        result = await self.repo.update(id, data)
        if result is None:
            raise NotFoundError()
        
    async def remove(self, id:int) -> bool:
        result = await self.repo.delete(id)
        if not result:
            raise NotFoundError()