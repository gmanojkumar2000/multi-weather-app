import httpx

WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

async def get_current_weather(lat: float, lon: float):
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(WEATHER_URL, params=params)
        data = resp.json()
        if not data.get("current_weather"):
            raise ValueError("Weather not found")
        cw = data["current_weather"]
        return {
            "temperature": cw["temperature"],
            "weather_code": cw["weathercode"],
            "wind_speed": cw["windspeed"],
            "observation_time": cw["time"]
        } 