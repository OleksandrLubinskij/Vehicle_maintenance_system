import json
import redis.asyncio as redis
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
class RedisCache:
    def __init__(self, redis_url:str=redis_url):
        self.redis = redis.from_url(redis_url, decode_responses=True)

    async def set(self, key:str, value:dict) -> None:
        await self.redis.set(key, json.dumps(value), ex=3600)

    async def get(self, key) -> dict:
        data = await self.redis.get(key)
        if not data: return None
        return json.loads(data)
     
    async def delete(self, key) -> None:
        await self.redis.delete(key)


    async def hset(self, key:str, id:int, data:dict, expire:int = 3600) -> None:
        json_data = json.dumps(data)
        await self.redis.hset(key, str(id), json_data)
        await self.redis.expire(key, expire)

    async def hget_by_id(self, key:str, id:int) -> dict:
        data = await self.redis.hget(key, str(id))
        return  json.loads(data) if data else None
    
    async def get_all_cached(self, key) -> dict:
        data = await self.redis.hgetall(key)
        return {car_id: json.loads(val) for car_id, val in data.items()}