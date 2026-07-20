from fastapi import Depends, APIRouter, Response
from app.schemas import UserLogin
from services.users.user_service import UserService
from services.users.fabric_users import get_user_service
from api.v1.auth.api_auth import AuthFacade
router = APIRouter()

@router.get("/")
async def read_all_users(user_service: UserService = Depends(get_user_service)):
    return await user_service.fetch_all()

@router.get("/{id}")
async def read_user(id: int, user_service: UserService = Depends(get_user_service)):
    return await user_service.fetch_by_id(id)

@router.get("/login")
async def login(response: Response,
                user_data: UserLogin,
                auth_facade: AuthFacade = Depends()):
    await auth_facade.login_user(response=response,
                                 user_data=user_data)