from fastapi import Depends, Response
from app.schemas import UserCreate, UserLogin
from app.security import  verify_password, create_access_token
from services.users.fabric_users import get_user_service
from services.users.user_service import UserService
from api.v1.auth.exceptions import UserAlreadyExistsError, InvalidPasswordError

class AuthFacade:
    def __init__(self,
                 user_service: UserService = Depends(get_user_service)):
        self.user_service = user_service
    async def login_user(self,
                         response: Response,
                         user_data: UserLogin):
        user = await self.user_service.fetch_user_by_login(user_data.login)
        if not user:
            raise UserAlreadyExistsError()
        if not verify_password(user_data.password, user.password):
            raise InvalidPasswordError()
        
        token_data = {
            "sub": user.login,
            "role": user.role.value
        }
        access_token = create_access_token(token_data)

        response.set_cookie(
            key="access_token",
            value=f"{access_token}",
            httponly=True,     
            samesite="none",
            secure=True
        )
        return {"message": "Successful login"}

    async def register_user(self,
                            new_user_data: UserCreate):
        existing_user = await self.user_service.fetch_user_by_login_or_fail(new_user_data.login)
        if existing_user:
            raise UserAlreadyExistsError()
        await self.user_service.register(new_user_data)
        return {"message": "User registered successfully"}

    async def logout_user(self, response:Response):
        response.delete_cookie(key="access_token")
        return {"status": "success", "message": "Logged out successfully"}