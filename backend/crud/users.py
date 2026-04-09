from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from get_db import get_db
from models import User
from schemas import UserModel

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.post("/create_user")
async def create_user(user:UserModel, db: Session = Depends(get_db)):
    new_user_dict = user.model_dump()
    new_user = User(**new_user_dict)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user_dict
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Помилка бази даних {str(e)}")
