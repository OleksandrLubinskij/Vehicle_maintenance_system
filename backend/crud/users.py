from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import User
from app.config import USER 
from app.security import get_password_hash

async def create_user(user, db):
    new_user_dict = user.model_dump()
    raw_password = new_user_dict.pop(USER.PASSWORD)
    hashed_password = get_password_hash(raw_password)
    new_user = User(
        login = new_user_dict.get(USER.LOGIN),
        password = hashed_password,
        role = new_user_dict.get(USER.ROLE)
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user_dict
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Помилка бази даних {str(e)}")

async def get_user_by_login(login, db) -> User | None:
    stmt = select(User).where(User.login == login)
    return db.execute(stmt).scalar_one_or_none()