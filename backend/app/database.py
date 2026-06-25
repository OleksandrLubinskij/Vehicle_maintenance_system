import os
import asyncio
from dotenv import load_dotenv
from app.models import Base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db(engine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all(bind=engine))
        await conn.run_sync(Base.metadata.create_all(bind=engine))

if __name__ == "__main__":
    asyncio.run(init_db(engine))
    print("Tables have been created succsefully!")