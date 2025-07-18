import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather, searchCities, WeatherResult, CitySuggestion } from "./api";
import { WeatherCard, WeatherIcon } from "./components/WeatherCard";
import { SkeletonCard } from "./components/SkeletonCard";

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: suggestions } = useQuery<CitySuggestion[]>({
    queryKey: ["search", query],
    queryFn: () => (query.length > 1 ? searchCities(query) : Promise.resolve([])),
    enabled: query.length > 1,
    staleTime: 60_000,
  });

  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useQuery<WeatherResult>({
    queryKey: ["weather", selected],
    queryFn: () => selected ? fetchWeather(selected) : Promise.reject(),
    enabled: !!selected,
    retry: false,
  });

  function handleSelect(s: CitySuggestion) {
    setSelected(`${s.latitude},${s.longitude}`);
    setQuery(`${s.name}${s.admin1 ? ", " + s.admin1 : ""}${s.country ? ", " + s.country : ""}`);
    setShowSuggestions(false);
    setUnit("C");
    refetch();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query) {
      setSelected(query);
      setShowSuggestions(false);
      setUnit("C");
      refetch();
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100">
      <h1 className="text-3xl font-bold mb-6">Weather-Now</h1>
      <form className="w-full max-w-md mb-4 relative" onSubmit={handleSubmit} autoComplete="off" role="search">
        <label htmlFor="city-search" className="sr-only">Search for a city</label>
        <input
          id="city-search"
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
          placeholder="Enter city name or lat,lon"
          aria-autocomplete="list"
          aria-controls="city-suggestions"
          aria-activedescendant={showSuggestions && suggestions && suggestions.length > 0 ? `suggestion-0` : undefined}
          aria-label="City search"
          className="pr-10 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go
        </button>
        {showSuggestions && suggestions && suggestions.length > 0 && (
          <ul
            id="city-suggestions"
            className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-auto"
            role="listbox"
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                id={`suggestion-${i}`}
                role="option"
                tabIndex={0}
                aria-selected={false}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                onMouseDown={() => handleSelect(s)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(s);
                }}
              >
                {s.name}{s.admin1 ? ", " + s.admin1 : ""}{s.country ? ", " + s.country : ""}
              </li>
            ))}
          </ul>
        )}
      </form>
      <section className="w-full max-w-md">
        {isLoading && <SkeletonCard />}
        {error && <div className="text-red-600 text-center">{(error as Error).message}</div>}
        {weather && !isLoading && (
          <WeatherCard data={weather} unit={unit} onToggleUnit={() => setUnit(unit === "C" ? "F" : "C")} />
        )}
      </section>
      <footer className="mt-8 text-xs text-gray-400">Powered by <a href="https://open-meteo.com/" className="underline">Open-Meteo</a></footer>
    </main>
  );
} 