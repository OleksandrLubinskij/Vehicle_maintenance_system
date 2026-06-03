import json
from redis import Redis
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
class RedisCache:
    def __init__(self, redis_url:str=redis_url):
        self.redis = Redis.from_url(redis_url, decode_responses=True)

    def set(self, key:str, value:dict) -> None:
        self.redis.set(key, json.dumps(value), ex=3600)

    def get(self, key) -> dict:
        data = self.redis.get(key)
        if not data: return None
        return json.loads(data)
     
    def delete(self, key) -> None:
        self.redis.delete(key)


    def hset(self, key:str, id:int, data:dict, expire:int = 3600) -> None:
        json_data = json.dumps(data)
        self.redis.hset(key, str(id), json_data)
        self.redis.expire(key, expire)

    def hget_by_id(self, key:str, id:int) -> dict:
        data = self.redis.hget(key, str(id))
        return  json.loads(data) if data else None
    
    def get_all_cached(self, key) -> dict:
        data = self.redis.hgetall(key)
        return {car_id: json.loads(val) for car_id, val in data.items()}