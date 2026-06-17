from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserLogin
import crud.users as users
from sqlalchemy import select
from app.models import User
from app.schemas import UserResponce
from api.v1.auth.get_current_user import get_current_user
from app.security import  verify_password, create_access_token


router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = await users.get_user_by_login(login=user_data.login, db=db)
    if (existing_user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="User with this name already exists!")
    await users.create_user(user=user_data, db=db)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(response: Response, user_data:UserLogin, db: Session = Depends(get_db)):
    user = await users.get_user_by_login(login=user_data.login, db=db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="User doesn`t exist!")
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect password")
    
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
async def get_all_users(db: Session = Depends(get_db)):
    stmt = select(User)
    users = db.execute(stmt).scalars().all()
    return users

@router.get("/get_me", response_model=UserResponce)
async def get_me(current_user:User =  Depends(get_current_user)) -> User:
    return current_user;