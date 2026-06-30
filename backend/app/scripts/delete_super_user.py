import asyncio
from app.database import SessionLocal
from sqlalchemy import select
from app.models import User

async def delete_super_user():
    async with SessionLocal() as session:
        stmt = select(User).where(User.login == "admin")
        result = await session.execute(stmt)
        super_user = result.scalar_one_or_none()
        if super_user:
            await session.delete(super_user)
            await session.commit()
            print("Super user deleted successfully.")
        else:
            print("No super user found.")

if __name__ == "__main__":
    asyncio.run(delete_super_user())