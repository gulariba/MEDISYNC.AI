import redis
import os
import json
from typing import Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class RedisCache:
    """Redis cache utility for the healthcare system"""

    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.client = redis.from_url(redis_url, decode_responses=True)
        self.default_ttl = 3600  # 1 hour default

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache with TTL"""
        try:
            ttl = ttl or self.default_ttl
            serialized = json.dumps(value)
            self.client.setex(key, ttl, serialized)
            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False

    def increment(self, key: str, amount: int = 1) -> int:
        """Increment a counter"""
        try:
            return self.client.incr(key, amount)
        except Exception as e:
            print(f"Redis increment error: {e}")
            return 0

    def set_with_expiry(self, key: str, value: Any, seconds: int) -> bool:
        """Set value with custom expiry time"""
        return self.set(key, value, ttl=seconds)

    def check_rate_limit(self, identifier: str, max_requests: int, window_seconds: int) -> bool:
        """
        Check if rate limit is exceeded
        Returns True if within limit, False if exceeded
        """
        key = f"rate_limit:{identifier}"
        try:
            current = self.client.get(key)
            if current is None:
                # First request in window
                self.client.setex(key, window_seconds, 1)
                return True

            count = int(current)
            if count >= max_requests:
                return False

            # Increment counter
            self.client.incr(key)
            return True
        except Exception as e:
            print(f"Rate limit check error: {e}")
            # On error, allow the request (fail open)
            return True

    def cache_agent_response(self, agent_name: str, input_hash: str, response: Any, ttl: int = 300) -> bool:
        """Cache agent response for deduplication"""
        key = f"agent_response:{agent_name}:{input_hash}"
        return self.set(key, response, ttl=ttl)

    def get_cached_agent_response(self, agent_name: str, input_hash: str) -> Optional[Any]:
        """Get cached agent response"""
        key = f"agent_response:{agent_name}:{input_hash}"
        return self.get(key)

    def health_check(self) -> bool:
        """Check if Redis is accessible"""
        try:
            self.client.ping()
            return True
        except Exception:
            return False


# Global cache instance
cache = RedisCache()
