import pytest
from fastapi import status
from httpx import ASGITransport, AsyncClient

import main


async def request(path: str, params: dict[str, str]):
    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.get(path, params=params)


@pytest.mark.asyncio
async def test_search_happy(monkeypatch):
    async def fake_search_cities(query: str):
        assert query == "Portland"
        return [
            {
                "name": "Portland",
                "country": "United States",
                "admin1": "Oregon",
                "latitude": 45.52,
                "longitude": -122.68,
            }
        ]

    monkeypatch.setattr(main, "search_cities", fake_search_cities)

    response = await request("/search", {"query": "Portland"})

    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["name"] == "Portland"


@pytest.mark.asyncio
async def test_weather_happy(monkeypatch):
    async def fake_weather(latitude: float, longitude: float):
        assert (latitude, longitude) == (45.5, -122.7)
        return {
            "temperature": 20,
            "weather_code": 1,
            "wind_speed": 10,
            "observation_time": "2026-10-11T12:00",
        }

    monkeypatch.setattr(main, "get_current_weather", fake_weather)

    response = await request("/weather", {"location": "45.5,-122.7"})

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "city": "45.5,-122.7",
        "latitude": 45.5,
        "longitude": -122.7,
        "temperature": 20,
        "weather_code": 1,
        "wind_speed": 10,
        "observation_time": "2026-10-11T12:00",
    }


@pytest.mark.asyncio
async def test_weather_404(monkeypatch):
    async def city_not_found(_location: str):
        raise ValueError("City not found")

    monkeypatch.setattr(main, "geocode_city", city_not_found)

    response = await request("/weather", {"location": "NotARealCity"})

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "City not found"
