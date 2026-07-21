from fastapi import Depends, APIRouter, Response
from app.schemas import ResetPassword, UserLogin, UserCreate
from api.v1.auth.dependencies import get_current_user
from services.users.user_service import UserService
from services.users.fabric_users import get_user_service
from api.v1.auth.api_auth import AuthFacade
router = APIRouter()

@router.get("/")
async def read_all_users(user_service: UserService = Depends(get_user_service)):

    return await user_service.fetch_all()

@router.post("/login")
async def login(response: Response,
                user_data: UserLogin,
                auth_facade: AuthFacade = Depends()):
    await auth_facade.login_user(response=response,
                                 user_data=user_data)
    
@router.get("/logout")
async def logout(response: Response,
                 auth_facade: AuthFacade = Depends()):
    await auth_facade.logout_user(response=response)

@router.post("/register")
async def register(new_user_data: UserCreate,
                   auth_facade: AuthFacade = Depends()):
    await auth_facade.register_user(new_user_data)

@router.get("/get_me")
async def get_me(current_user = Depends(get_current_user)):
    return current_user

@router.get("/{id}")
async def read_user(id: int, user_service: UserService = Depends(get_user_service)):
    return await user_service.fetch_by_id(id)

@router.patch("/edit_password")
async def edit_user_password(passwords: ResetPassword, 
                             user_service: UserService = Depends(get_user_service),
                             current_user = Depends(get_current_user)):
    await user_service.update_user_password(id=current_user.id, 
                                            passwords=passwords, 
                                            current_password=current_user.password)
    

