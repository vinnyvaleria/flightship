// src/services/realtimeWeatherService.js

const BASE_URL = "https://api.tomorrow.io/v4";
const SEARCH_ID = "weather/realtime";
const TOKEN = import.meta.env.VITE_TOMORROW_WEATHER_TOKEN;

const show = async (location) => {
    const url = `${BASE_URL}/${SEARCH_ID}?location=${location}&apikey=${TOKEN}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json",
            "accept-encoding": "deflate, gzip, br",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch weather.");

    const data = await res.json();
    return data;
};

export { show };
