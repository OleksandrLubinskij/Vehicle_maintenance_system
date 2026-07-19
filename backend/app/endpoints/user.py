from fastapi import Depends, APIRouter
from services.users.user_service import UserService
from services.users.fabric_users import get_user_service
router = APIRouter()

@router.get("/")
async def read_all_users(user_service: UserService = Depends(get_user_service)):
    return await user_service.fetch_all()

@router.get("/{id}")
async def read_user(id: int, user_service: UserService = Depends(get_user_service)):
    return await user_service.fetch_by_id(id)