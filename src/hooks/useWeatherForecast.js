// src/hooks/useWeatherForecast.js

import useWeatherContext from "./useWeatherContext";

import { useEffect, useState } from "react";

/**
 * Custom hook to fetch weather forecasts from Tomorrow.io.
 * @param {string} location The city of the airport is located at.
 * */

const useWeatherForecast = (location) => {
    const { getWeather } = useWeatherContext();
    const [weatherInfo, setWeatherInfo] = useState({
        isRainLikely: false,
        isSnowLikely: false,
        isWindy: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!location) return;

        async function fetchWeather() {
            setWeatherInfo((prev) => ({ ...prev, loading: true }));
            try {
                const result = await getWeather(location);
                setWeatherInfo({
                    ...result,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                setWeatherInfo({
                    isRainLikely: false,
                    isSnowLikely: false,
                    isWindy: false,
                    loading: false,
                    error: err.message,
                });
            }
        }

        fetchWeather();
    }, [location]);

    return weatherInfo;
};

export default useWeatherForecast;
