// src/hooks/useDebounce.js

import { useState, useEffect } from "react";

// function to set certain action dependent on value after a delay
const useDebounce = (value, delay= 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
