import asyncio
from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

GREEN = "\033[92m"
RED = "\033[91m"
CYAN = "\033[96m"
RESET = "\033[0m"

async def create_super_user():
    username = "admin"
    raw_password = "secure_password"
    
    async with SessionLocal() as session:
        hased_password = pwd_context.hash(raw_password)
        super_user = User(
            login=username,
            password=hased_password,
            role="Admin"
        )
        session.add(super_user)
        await session.commit()
    
    print(f"\n{GREEN}Суперкористувача успішно створено!{RESET}")
    print(f"Логін: {CYAN}{username}{RESET}")
    print(f"Пароль: {CYAN}{raw_password}{RESET}")
    print(f"{RED}УВАГА:Обов'язково змініть цей пароль після першого входу в систему!{RESET}\n")

if __name__ == "__main__":
    asyncio.run(create_super_user())