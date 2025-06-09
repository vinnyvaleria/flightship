// src/hooks/useAirportSuggestions.js

import { useState, useEffect, useRef } from "react";
import useCitySuggestions from "./useCitySuggestions";

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

    // store aiports records at once
    const allAirports = useRef([]);
    const { allCities } = useCitySuggestions();

    // function to fetch all pages of records from airtable
    const fetchAllAirports = async () => {
        let allRecords = [];
        let offset;

        try {
            do {
                // expand the city data from airport table returns as the data is linked in airtable
                // hence response will only show the record ID if not expanded
                const url = offset
                    ? `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?offset=${offset}`
                    : `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch airports.");

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

    // get the city name by record id
    const getCityById = (id) => {
        try {
            if (!allCities?.current || !Array.isArray(allCities.current)) {
                console.log(
                    "allCities.current is not available:",
                    allCities?.current
                );
                return null;
            }
            const cityObject = allCities.current.find(
                (city) => city?.id === id
            );
            return cityObject?.fields?.city || null;
        } catch (error) {
            console.error("Error in getCityById:", error, "ID:", id);
            return null;
        }
    };

    useEffect(() => {
        // filter suggestions on only when input has more than 2 characters
        if (query?.length < 2) {
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

                // console.log("All cities: ", allCities);

                // search through both city names and airport names
                const matched = allAirports.current
                    .filter((record) => {
                        // ensure record and fields exist
                        if (!record?.fields) return false;

                        // check if city field exists and is an array before accessing [0]
                        const cityField = record.fields.city;
                        // console.log(
                        //     "Processing record:",
                        //     record.id,
                        //     "cityField:",
                        //     cityField
                        // );

                        if (
                            !cityField ||
                            !Array.isArray(cityField) ||
                            cityField.length === 0
                        ) {
                            // skip records without valid city data but don't return false
                            // allow matching by airport name and IATA code only
                            const airportName = record.fields.name || "";
                            const iataCode = record.fields.iata || "";

                            return (
                                airportName
                                    .toLowerCase()
                                    .includes(query.toLowerCase()) ||
                                iataCode
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                            );
                        }

                        const cityId = cityField[0];
                        const cityName = cityId
                            ? getCityById(cityId) || ""
                            : "";
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
                    .slice(0, 8); // limit to 8 matches

                setSuggestions(
                    matched.map((record) => {
                        // check if city field exists and is an array before accessing [0]
                        const cityField = record.fields.city;
                        const cityId =
                            cityField &&
                            Array.isArray(cityField) &&
                            cityField.length > 0
                                ? cityField[0]
                                : null;

                        const cityName = cityId
                            ? getCityById(cityId) || "Unknown City"
                            : "Unknown City";

                        return {
                            id: record.id,
                            cityId: record.fields.city,
                            cityName: cityName,
                            airportName:
                                record.fields.name || "Unknown Airport",
                            iataCode: record.fields.iata || "",
                            // Use the correct field names
                            displayText: `${cityName} - ${
                                record.fields.name || "Unknown Airport"
                            } (${record.fields.iata || ""})`,
                        };
                    })
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAirports();
    }, [query, allCities]);

    // console.log("Suggestions:", suggestions);
    return { suggestions, loading, error, allAirports };
};

export default useAirportSuggestions;
