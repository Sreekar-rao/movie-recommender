import redis
import json
import os

REDIS_URL = os.environ.get("REDIS_URL","rediss://default:gQAAAAAAAw3HAAIgcDFmZjY3NTlmOWJlODI0OGM0YWFhYzY1ZGJlZWZhM2MyZg@known-gibbon-200135.upstash.io:6379")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_cached_recommendations(user_id: int):
    key = f"recs:{user_id}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    return None

def set_cached_recommendations(user_id: int, recommendations, ttl_seconds=3600):
    key = f"recs:{user_id}"
    r.set(key, json.dumps(recommendations), ex=ttl_seconds)