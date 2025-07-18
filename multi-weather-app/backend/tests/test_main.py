import pytest
from httpx import AsyncClient
from fastapi import status
from backend.main import app

import asyncio

@pytest.mark.asyncio
async def test_search_happy():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/search", params={"query": "Portland"})
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert any("Portland" in c["name"] for c in data)

@pytest.mark.asyncio
async def test_weather_happy():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/weather", params={"location": "Portland"})
        assert resp.status_code == 200
        data = resp.json()
        assert "temperature" in data
        assert "weather_code" in data
        assert "wind_speed" in data
        assert "observation_time" in data

@pytest.mark.asyncio
async def test_weather_404():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/weather", params={"location": "NotARealCity"})
        assert resp.status_code == status.HTTP_404_NOT_FOUND
        assert resp.json()["detail"] == "City not found" 