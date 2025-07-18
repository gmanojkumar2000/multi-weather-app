import React from "react";
import { WeatherResult } from "../api";

export function WeatherIcon({ code }: { code: number }) {
  const map: Record<number, string> = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌦️", 56: "🌧️", 57: "🌧️",
    61: "🌦️", 63: "🌦️", 65: "🌧️", 66: "🌧️", 67: "🌧️",
    71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️", 80: "🌧️", 81: "🌧️", 82: "🌧️",
    85: "❄️", 86: "❄️", 95: "⛈️", 96: "⛈️", 99: "⛈️"
  };
  return <span aria-label="Weather icon" className="text-4xl">{map[code] || "❓"}</span>;
}

export function WeatherCard({ data, unit, onToggleUnit }: { data: WeatherResult; unit: "C" | "F"; onToggleUnit: () => void }) {
  const temp = unit === "C" ? data.temperature : (data.temperature * 9) / 5 + 32;
  const tempLabel = unit === "C" ? "°C" : "°F";
  const localTime = new Date(data.observation_time).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", weekday: "short", day: "numeric", month: "short" });
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2" role="region" aria-label="Weather card">
      <div className="text-lg font-semibold">{data.city}</div>
      <div className="text-sm text-gray-500">{localTime}</div>
      <WeatherIcon code={data.weather_code} />
      <div className="flex items-center gap-2 mt-2">
        <span className="text-3xl font-bold">{Math.round(temp)}</span>
        <button
          className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs border"
          onClick={onToggleUnit}
          aria-label="Toggle temperature unit"
        >
          {tempLabel}
        </button>
      </div>
      <div className="text-sm text-gray-600">Wind: {data.wind_speed} km/h</div>
    </div>
  );
} 