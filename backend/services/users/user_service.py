from app.security import get_password_hash
from services.base_service import BaseCRUDService
from app.models import User
from app.schemas import UserCreate
from crud.users import UserRepository
from fastapi import HTTPException, status
from app.config import USER
class UserService(BaseCRUDService):
    repo: UserRepository
    def __init__(self, repo: UserRepository):
        super().__init__(repo)
    
    async def fetch_user_by_login(self, login: str) -> User:
        user = await self.repo.get_user_by_login(login)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Not found!")
        return user

    async def register(self, new_user_data: UserCreate, role="User") -> UserCreate:
        new_user_dict = new_user_data.model_dump()
        raw_password = new_user_dict.pop(USER.PASSWORD)
        hashed_password = get_password_hash(raw_password)
        new_user = User(
            login = new_user_dict.get(USER.LOGIN),
            password = hashed_password,
            role=role
        )
        self.repo.add(new_user)
