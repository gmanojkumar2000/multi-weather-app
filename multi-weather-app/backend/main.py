from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.geocode import geocode_city, search_cities
from services.weather import get_current_weather
from cache import cache

app = FastAPI(
    title="Weather-Now API",
    description="Get current weather for any city using Open-Meteo.",
    version="1.0.0",
    openapi_tags=[
        {"name": "weather", "description": "Weather endpoints"},
        {"name": "search", "description": "City search endpoints"}
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
async def root():
    return {"status": "ok"}

@app.get("/weather", tags=["weather"])
async def get_weather(location: str = Query(..., description="City name or lat,lon")):
    try:
        if "," in location:
            lat, lon = map(float, location.split(","))
            city_info = {"name": location, "latitude": lat, "longitude": lon}
        else:
            city_info = await geocode_city(location)
            lat, lon = city_info["latitude"], city_info["longitude"]
        weather = await get_current_weather(lat, lon)
        return {
            "city": city_info.get("name"),
            "latitude": lat,
            "longitude": lon,
            **weather
        }
    except ValueError:
        raise HTTPException(status_code=404, detail="City not found")

@app.get("/search", tags=["search"])
async def search(query: str = Query(..., min_length=2)):
    return await search_cities(query) 