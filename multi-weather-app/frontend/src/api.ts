export type WeatherResult = {
  city: string;
  latitude: number;
  longitude: number;
  temperature: number;
  weather_code: number;
  wind_speed: number;
  observation_time: string;
};

export type CitySuggestion = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export async function fetchWeather(location: string): Promise<WeatherResult> {
  const res = await fetch(`/weather?location=${encodeURIComponent(location)}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error fetching weather');
  }
  return res.json();
}

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const res = await fetch(`/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Error searching cities');
  return res.json();
} 