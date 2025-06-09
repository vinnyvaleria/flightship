import { useState } from "react";
import useAirportSuggestions from "./useAirportSuggestions";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tblZcUyPOWsIIBLJA";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Custom hook to fetch saved flights from Airtable.
 * @param {Array} searchFormData The search form data as array
 */

const useSaveFlight = (searchFormData) => {
    // use Set to prevent duplicates
    // if we use normal array, will need to check manually every time
    const [savedFlights, setSavedFlights] = useState(new Set());
    const [savingFlights, setSavingFlights] = useState(new Set());

    // retrieve airport record id to store in saved flights
    const { allAirports } = useAirportSuggestions();

    // function to convert date to iso format
    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toISOString().split("T")[0]; // ISO short format
    };

    const saveFlight = async (flightData) => {
        // use the available booking token from API return
        const flightId = flightData.booking_token;

        if (savedFlights.has(flightId) || savingFlights.has(flightId)) return;

        setSavingFlights((prev) => new Set(prev).add(flightId));

        try {
            const flightInfo = flightData.flights[0];
            // this refers to last item and will be needed especially if there are layovers
            const lastFlight = flightData.flights.at(-1);

            const saveRecord = {
                fields: {
                    // based on form data
                    bookingID: `${searchFormData?.bookingId}_${searchFormData?.departureIATA}_${searchFormData?.arrivalIATA}`,
                    dep: [
                        (
                            allAirports.current.find(
                                (airport) =>
                                    airport.fields.iata ===
                                    flightInfo.departure_airport.airport_code
                            ) || {}
                        ).id,
                    ],
                    arr: [
                        (
                            allAirports.current.find(
                                (airport) =>
                                    airport.fields.iata ===
                                    lastFlight.arrival_airport.airport_code
                            ) || {}
                        ).id,
                    ],

                    // based on api response and displayed
                    airline: flightInfo.airline,
                    flight_numbers: JSON.stringify(
                        flightData.flights.map((flight) => ({
                            flightNumber: flight.flight_number,
                            aircraft: flight.aircraft,
                        }))
                    ),

                    dep_date: formatDate(flightInfo.departure_airport.time),
                    dep_time: flightInfo.departure_airport.time,
                    arr_date: formatDate(lastFlight.arrival_airport.time),
                    arr_time: lastFlight.arrival_airport.time,
                    duration: flightData.duration.text,

                    // extended data added
                    stops: flightData.stops,
                    hasLayover: flightData.layovers !== null,
                    layover_details: flightData.layovers
                        ? JSON.stringify(
                              flightData.layovers.map((layover) => ({
                                  duration: layover.duration_label,
                                  city: layover.city,
                                  airportName: layover.airport_name,
                                  airportCode: layover.airport_code,
                              }))
                          )
                        : null,

                    // additional metadata - for record tracking purpose
                    saved_date: new Date().toISOString(),
                    data_source: "Flight API",
                },
            };

            const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saveRecord),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Airtable Error: ${errorData.error?.message}`);
            }

            setSavedFlights((prev) => new Set(prev).add(flightId));
        } catch (err) {
            console.error("Error saving flight:", err);
            alert(`Error saving flight: ${err.message}`);
        } finally {
            setSavingFlights((prev) => {
                const updated = new Set(prev);
                updated.delete(flightId);
                return updated;
            });
        }
    };

    return {
        saveFlight,
        savedFlights,
        savingFlights,
    };
};

export default useSaveFlight;
