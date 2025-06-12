// src/hooks/useWeatherContext.js

import { WeatherContext } from "@/contexts/WeatherProvider";

import { useContext } from "react";

const useWeatherContext = () => {
    // retrieves the current context value
    const context = useContext(WeatherContext);

    if (!context) {
        throw new Error(
            "useWeatherContext must be used within WeatherProvider"
        );
    }

    // return context so components encapsulated by this can use the context
    return context;
};

export default useWeatherContext;
