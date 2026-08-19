from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from crud.users import UserRepository
from services.users.user_service import UserService


def get_user_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db=db)

def get_user_service(repo: UserRepository = Depends(get_user_repo)) -> UserService:
      return UserService(repo=repo)