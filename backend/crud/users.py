from sqlalchemy import select, update
from app.models import User
from crud.base_repository import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession

class UserRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)

    async def get_user_by_login(self, login: str) -> User | None:
        stmt = select(User).where(User.login == login)
        return (await self.db.execute(stmt)).scalar_one_or_none()
    
    async def update_password(self, id: int, new_password: str) -> str | None:
        stmt = update(User).where(User.id == id).values(password = new_password)
        result = await self.db.execute(stmt)
        return result