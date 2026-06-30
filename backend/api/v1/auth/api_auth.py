from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import UserCreate, UserLogin, ResetPasssword
import crud.users as users
from sqlalchemy import select, update
from app.models import User
from app.schemas import UserResponce
from api.v1.auth.get_current_user import get_current_user
from app.security import  verify_password, create_access_token


router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, 
                   db: AsyncSession = Depends(get_db)):
    existing_user = await users.get_user_by_login(login=user_data.login, db=db)
    if (existing_user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail={
                                "code":0,
                                "message":"Користувач з таким іменем уже існує"})
    await users.create_user(user=user_data, db=db)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(response: Response, 
                user_data:UserLogin, 
                db: AsyncSession = Depends(get_db)):
    user = await users.get_user_by_login(login=user_data.login, db=db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail={
                                "code": 1,
                                "message":"Користувача не знайдено"})
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail={
                                "code": 2,
                                "message": "Неправильний пароль"})
    
    token_data = {
        "sub": user.login,
        "role": user.role.value
    }
    access_token = create_access_token(token_data)

    response.set_cookie(
        key="access_token",
        value=f"{access_token}",
        httponly=True,     
        secure=False,    
        samesite="lax",
    )
    return {"message": "Successful login"}

@router.get("/logout")
async def logout(response:Response):
    response.delete_cookie(key="access_token")
    return {"status": "success", "message": "Logged out successfully"}

@router.get("/get_all_users")
async def get_all_users(db: AsyncSession = Depends(get_db)):
    stmt = select(User)
    users = (await db.execute(stmt)).scalars().all()
    return users

@router.get("/get_me", response_model=UserResponce)
async def get_me(current_user:User = Depends(get_current_user)) -> User:
    return current_user;

@router.put("/change_password")
async def change_password(passwords: ResetPasssword,
                         current_user:User = Depends(get_current_user),
                         db: AsyncSession = Depends(get_db)):

    if not verify_password(passwords.old_password, current_user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail={
                                "code": 0,
                                "message": "Старий пароль неправильний!"})
    stmt = update(User).where(User.id == current_user.id).values(password=users.get_password_hash(passwords.new_password))
    await db.execute(stmt)
    await db.commit()
    return {"message": "Password changed successfully"}