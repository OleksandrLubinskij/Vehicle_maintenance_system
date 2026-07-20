from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import User
from app.config import USER 
from app.security import get_password_hash
from crud.base_repository import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession

class UserRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)

# async def create_user(new_user: dict, role="User"):
#     new_user_dict = user.model_dump()
#     raw_password = new_user_dict.pop(USER.PASSWORD)
#     hashed_password = get_password_hash(raw_password)
#     new_user = User(
#         login = new_user_dict.get(USER.LOGIN),
#         password = hashed_password,
#         role=role
#     )
#     try:
#         db.add(new_user)
#         await db.commit()
#         await db.refresh(new_user)
#         return new_user
#     except Exception as e:
#         await db.rollback()
#         raise HTTPException(status_code=500, detail=f"Помилка бази даних {str(e)}")

    async def get_user_by_login(self, login: str) -> User | None:
        stmt = select(User).where(User.login == login)
        return (await self.db.execute(stmt)).scalar_one_or_none()