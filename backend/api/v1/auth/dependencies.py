from enum import Enum
from fastapi import Cookie, Depends
from jose import JWTError, jwt
from app.models import User
from app.config import ALGORITHM, SECRET_KEY
from services.users.fabric_users import get_user_service
from services.users.user_service import UserService
from api.v1.auth.exceptions import NotAuthenticatedError, PermissionDeniedError


async def get_current_user(
    access_token: str | None = Cookie(None), 
    user_service: UserService = Depends(get_user_service)
):

    if not access_token:
        raise NotAuthenticatedError("Session is over! Please login again.")
        
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise NotAuthenticatedError("Invalid token payload!")
    except JWTError:
        raise NotAuthenticatedError("Invalid token!")
    
    user = await user_service.fetch_user_by_login(login)
    if not user:
        raise NotAuthenticatedError("User not found!")

    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = [role.lower() for role in allowed_roles]

    def __call__(self, user: User = Depends(get_current_user)) -> User: 
        user_role_value = user.role.value if isinstance(user.role, Enum) else user.role
        user_role_str = str(user_role_value).lower()
        
        print(f"User role string: {user_role_str}")
        print(f"Allowed roles: {self.allowed_roles}")
        
        if user_role_str not in self.allowed_roles:
            raise PermissionDeniedError()
        return user
    



