import json

import httpx

from cache import cache

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"


async def geocode_city(city: str):
    cache_key = f"geocode:{city.lower()}"
    cached = await cache.get(cache_key)
    if cached:
        return json.loads(cached)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            GEOCODE_URL,
            params={"name": city, "count": 1, "language": "en", "format": "json"},
        )
        data = resp.json()
        if not data.get("results"):
            raise ValueError("City not found")
        result = data["results"][0]
        await cache.set(cache_key, json.dumps(result))
        return result


async def search_cities(query: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            GEOCODE_URL,
            params={"name": query, "count": 5, "language": "en", "format": "json"},
        )
        data = resp.json()
        return [
            {
                "name": r["name"],
                "country": r.get("country"),
                "admin1": r.get("admin1"),
                "latitude": r["latitude"],
                "longitude": r["longitude"],
            }
            for r in data.get("results", [])
        ]
