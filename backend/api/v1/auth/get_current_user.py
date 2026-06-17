from fastapi import Cookie, Depends, HTTPException, status
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import SECRET_KEY, ALGORITHM
from crud.users import get_user_by_login

async def get_current_user(
    access_token: str | None = Cookie(None), 
    db: Session = Depends(get_db)
):
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session`s over. Please login again.",
    )

    if not access_token:
        raise unauthorized_exception
        
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise unauthorized_exception
    except JWTError:
        raise unauthorized_exception
    
    user = await get_user_by_login(login=login, db=db)
    if not user:
        raise unauthorized_exception

    return user