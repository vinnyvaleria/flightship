// src/hooks/useCitySuggestions.js
import { useState, useEffect, useRef } from "react";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tblbmkIeoeKhKbSKt";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
// console.log("Token is ", TOKEN);

/**
 * Custom hook to fetch city suggestions from Airtable.
 * @param {string} query The search input string
 */

const useCitySuggestions = (query = "") => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // store all records at once
    const allCities = useRef([]);

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch cities.");

                // parse JSON string to JS object
                const data = await res.json();

                // store data response to allCities
                allCities.current = data.records;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Filter suggestions on only when input has more than 3 characters
    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const matched = allCities.current
            .map((record) => record.fields.city) // only search through the city names
            .filter(
                (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 4); // returns first 5 items that match in allCities

        setSuggestions(matched);
    }, [query]);

    return { suggestions, loading, error };
};

export default useCitySuggestions;
