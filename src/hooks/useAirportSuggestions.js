// src/hooks/useAirportSuggestions.js

import useDebounce from "./useDebounce";

import { useState, useEffect } from "react";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tbl6yKWKSNtTDI6o2";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Custom hook to fetch airport suggestions from Airtable.
 * @param {string} query The search input string
 */

const useAirportSuggestions = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // debounce query and only search after 200ms of no typing
    const debouncedQuery = useDebounce(query);

    useEffect(() => {
        // filter suggestions on only when input has more than 2 characters
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setSuggestions([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchFilteredAirports = async () => {
            setLoading(true);
            setError(null);

            try {
                // create filter formula for searching across multiple fields
                // this is case insensitive so we no longer need to use toLowerCase
                // https://www.youtube.com/watch?v=mlhwsGuF4QU

                const filterFormula = `OR(SEARCH(LOWER("${debouncedQuery}"), LOWER(name)),SEARCH(LOWER("${debouncedQuery}"), LOWER(ARRAYJOIN(city, ","))),SEARCH(LOWER("${debouncedQuery}"), LOWER(iata)))`;
                // properly encodes special characters if any with URLSearchParams
                const params = new URLSearchParams({
                    filterByFormula: filterFormula,
                });

                // expand the city data from airport table returns as the data is linked in airtable
                // hence response will only show the record ID if not expanded
                const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?${params}`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch airports.");

                const data = await res.json();
                console.log("Airport data :", data);

                const matched = data.records.map((record) => {
                    // check if city field exists and is an array before accessing [0]
                    const cityField = record.fields.city;
                    const cityName =
                        cityField &&
                        Array.isArray(cityField) &&
                        cityField.length > 0
                            ? cityField[0]
                            : null;

                    return {
                        id: record.id,
                        cityId: record.fields.city,
                        cityName: cityName,
                        airportName: record.fields.name || "Unknown Airport",
                        iataCode: record.fields.iata || "",
                        // Use the correct field names
                        displayText: `${cityName} - ${
                            record.fields.name || "Unknown Airport"
                        } (${record.fields.iata || ""})`,
                    };
                });

                setSuggestions(matched);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredAirports();
    }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    // console.log("Suggestions:", suggestions);
    return { suggestions, loading, error };
};

export default useAirportSuggestions;
