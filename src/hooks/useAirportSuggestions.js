// src/hooks/useAirportSuggestions.js

import { useState, useEffect, useRef } from "react";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tbl6yKWKSNtTDI6o2";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Custom hook to fetch city suggestions from Airtable.
 * @param {string} query The search input string
 */

const useAirportSuggestions = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // store aiports records at once
    const allAirports = useRef([]);

    // function to fetch all pages of records from airtable
    const fetchAllAirports = async () => {
        let allRecords = [];
        let offset;

        try {
            do {
                // expand the city data from airport table returns as the data is linked in airtable
                // hence response will only show the record ID if not expanded
                const url = offset
                    ? `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?offset=${offset}&expand[]=city`
                    : `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?expand[]=city`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch airports.");

                const data = await res.json();
                console.log("Data:", data);

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

        const fetchAirports = async () => {
            setLoading(true);
            setError(null);

            try {
                // fetch only if the data storage is empty
                if (allAirports.current.length === 0) {
                    allAirports.current = await fetchAllAirports();
                }

                // search through both city names and airport names
                const matched = allAirports.current
                    .filter((record) => {
                        // check if the city data linked in airport table is found
                        const cityName =
                            record.fields.city?.[0]?.fields?.city || "";
                        const airportName = record.fields.name || "";
                        const iataCode = record.fields.iata || "";

                        const match =
                            cityName
                                .toLowerCase()
                                .includes(query.toLowerCase()) ||
                            airportName
                                .toLowerCase()
                                .includes(query.toLowerCase()) ||
                            iataCode
                                .toLowerCase()
                                .includes(query.toLowerCase());

                        return match;
                    })
                    .slice(0, 5); // Limit to 5 matches

                setSuggestions(
                    matched.map((record) => ({
                        id: record.id,
                        city: record.fields.city,
                        airportName: record.fields.airportName,
                        iataCode: record.fields.iataCode,
                        // format suggestions to show "Airport Name, City (IATA)"
                        displayText: `${record.fields.city} - ${record.fields.airportName} (${record.fields.iataCode})`,
                    }))
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAirports();
    }, [query]);
};

export default useAirportSuggestions;
