// src/contexts/WeatherProvider.js

import analyseWeather from "@/utils/analyseWeather";

import * as realtimeWeatherService from "@/services/realtimeWeatherService";

import { createContext, useRef } from "react";
// create context for saved weather state
const WeatherContext = createContext();

export function WeatherProvider({ children }) {
    // store any fetch data of the same location (to reduce api calls)
    const cache = useRef({});

    const getWeather = async (location) => {
        if (!location) return null;

        if (cache.current[location]) {
            return cache.current[location];
        }

        // fetch weather data based on the location passed in
        const data = await realtimeWeatherService.show(location);
        console.log("Weather data of ", location, ":", data);

        // get the return of how likely it will rain, snow or windy
        const processed = analyseWeather(data);
        console.log("Weather analyse result :", processed);

        // include raw data in the storage (cache)
        cache.current[location] = { ...processed, raw: data };
        console.log("Current weather cache :", cache.current);

        return cache.current[location];
    };

    return (
        <WeatherContext.Provider value={{ getWeather }}>
            {children}
        </WeatherContext.Provider>
    );
}

export default WeatherProvider;
export { WeatherContext };
