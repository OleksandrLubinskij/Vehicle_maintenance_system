from app.security import get_password_hash, verify_password
from api.v1.auth.exceptions import InvalidPasswordError
from services.base_service import BaseCRUDService
from app.models import User
from app.schemas import ResetPassword, UserCreate
from crud.users import UserRepository
from fastapi import HTTPException, status
from app.config import USER
from app.exceptions import NotFoundError
class UserService(BaseCRUDService):
    repo: UserRepository
    def __init__(self, repo: UserRepository):
        super().__init__(repo)
    
    async def fetch_user_by_login(self, login: str) -> User:
        user = await self.repo.get_user_by_login(login)
        if not user:
            raise NotFoundError()
        return user

    async def fetch_user_by_login_or_fail(self, login: str) -> User | None:
        user = await self.repo.get_user_by_login(login)
        if not user:
            return None
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
        await self.repo.add(new_user)

    async def update_user_password(self, id:int, passwords: ResetPassword, current_password: str):
        if not verify_password(passwords.old_password, current_password):
            raise InvalidPasswordError("Старий пароль неправильний!")
        
        hashed_new_password = get_password_hash(passwords.new_password)
        await self.repo.update_password(id=id, new_password=hashed_new_password)
        
