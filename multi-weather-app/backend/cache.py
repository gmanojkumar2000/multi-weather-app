import asyncio
import os
from typing import Any

try:
    import redis.asyncio as redis
except ImportError:
    redis = None


class Cache:
    def __init__(self):
        self._redis = None
        self._memory = {}
        self._ttl = 60 * 60 * 24  # 24 hours
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", "6379"))
        if redis:
            self._redis = redis.from_url(
                f"redis://{redis_host}:{redis_port}", decode_responses=True
            )

    async def get(self, key: str) -> Any | None:
        if self._redis:
            val = await self._redis.get(key)
            if val:
                return val
        else:
            entry = self._memory.get(key)
            if entry and entry[1] > asyncio.get_event_loop().time():
                return entry[0]
            elif entry:
                del self._memory[key]
        return None

    async def set(self, key: str, value: Any, ttl: int | None = None):
        ttl = ttl or self._ttl
        if self._redis:
            await self._redis.set(key, value, ex=ttl)
        else:
            self._memory[key] = (value, asyncio.get_event_loop().time() + ttl)


cache = Cache()
