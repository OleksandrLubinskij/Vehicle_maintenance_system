import asyncio
from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_super_user():
    async with SessionLocal() as session:
        hased_password = pwd_context.hash("secure_password")
        super_user = User(
            login="admin",
            password=hased_password,
            role="Admin"
        )
        session.add(super_user)
        await session.commit()
    
    print("Super user created successfully.")

if __name__ == "__main__":
    asyncio.run(create_super_user())