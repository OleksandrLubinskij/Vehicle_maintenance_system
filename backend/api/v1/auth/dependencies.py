from enum import Enum
from fastapi import Depends, HTTPException, status
from app.models import User
from api.v1.auth.get_current_user import get_current_user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = [role.lower() for role in allowed_roles]

    def __call__(self, user: User = Depends(get_current_user)) -> User: 
        user_role_value = user.role.value if isinstance(user.role, Enum) else user.role
        user_role_str = str(user_role_value).lower()
        
        print(f"User role string: {user_role_str}")
        print(f"Allowed roles: {self.allowed_roles}")
        
        if user_role_str not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have rights to perform this action"
            )
        return user