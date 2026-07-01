import os
import asyncio
from dotenv import load_dotenv
from app.models import Base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}
if "pooler.supabase.com" in DATABASE_URL:
    connect_args = {"server_settings": {"statement_cache_size": "0"}}
engine = create_async_engine(
    DATABASE_URL,
    connect_args={
        "server_settings": {"statement_cache_size": "0"},
        "prepared_statement_cache_size": 0 
    }
)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()

async def init_db(engine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_db(engine))
    print("Tables have been created succsefully!")