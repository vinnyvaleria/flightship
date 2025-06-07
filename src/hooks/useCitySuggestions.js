// src/hooks/useCitySuggestions.js

import { useState, useEffect, useRef } from "react";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tblbmkIeoeKhKbSKt";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
// console.log("Token is", TOKEN);

/**
 * Custom hook to fetch city suggestions from Airtable.
 * @param {string} query The search input string
 */

const useCitySuggestions = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // store all records at once
    const allCities = useRef([]);

    // function to fetch all pages of records from airtable
    const fetchAllCities = async () => {
        let allRecords = [];
        let offset;

        try {
            do {
                const url = offset
                    ? `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?offset=${offset}`
                    : `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch cities.");

                // parse JSON string to JS object
                const data = await res.json();
                // console.log("Data:", data);

                allRecords = allRecords.concat(data.records);
                offset = data.offset;
            } while (offset);
            return allRecords;
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    useEffect(() => {
        // filter suggestions on only when input has more than 2 characters
        if (query.length < 2) {
            setSuggestions([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchCities = async () => {
            setLoading(true);
            setError(null);

            try {
                // fetch only if the data storage is empty
                if (allCities.current.length === 0) {
                    // store data
                    allCities.current = await fetchAllCities();
                }
                // only search through the city names
                const matched = allCities.current
                    .filter((record) => {
                        const city = record.fields.city;
                        // console.log("Type of city", city, typeof city);

                        const match =
                            typeof city === "string" &&
                            city.toLowerCase().includes(query.toLowerCase());

                        // if (match) console.log("Matched city:", city);
                        return match;
                    })
                    .slice(0, 5); // Limit to 5 matches

                setSuggestions(matched.map((record) => record.fields.city));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, [query]);

    // console.log(
    //     "Suggestions:",
    //     suggestions,
    //     "Type:",
    //     Array.isArray(suggestions)
    // );
    return { suggestions, loading, error };
};

export default useCitySuggestions;
