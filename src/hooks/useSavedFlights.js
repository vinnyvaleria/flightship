// src/hooks/useSavedFlights.js

import getAirportByIATA from "@/utils/getAirportByIATA";

import { useState } from "react";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tblZcUyPOWsIIBLJA";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Custom hook to fetch saved flights from Airtable.
 * @param {Array} searchFormData The search form data as array
 */

const useSavedFlights = (searchFormData) => {
    const [error, setError] = useState(null);

    // if we use normal array, will need to check manually every time
    const [savedFlights, setSavedFlights] = useState(new Set());
    const [savingFlights, setSavingFlights] = useState(new Set());

    // function to convert date to iso format
    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toISOString().split("T")[0]; // ISO short format
    };

    // split booking id generation as a separate function
    const generateBookingId = () => {
        return `${searchFormData?.bookingId}_${searchFormData?.departureIATA}_${searchFormData?.arrivalIATA}`;
    };

    // check if the booking id and itinerary submitted is duplicated
    const isDuplicateBookingId = () => {
        const id = generateBookingId();
        const isDuplicated = Array.from(savedFlights).some((savedId) =>
            savedId.includes(id)
        );

        if (isDuplicated) setError("There is an existing record found!");

        return isDuplicated;
    };

    const saveFlight = async (flightData) => {
        // use the available booking token from API return
        const flightId = flightData.booking_token;

        if (
            savedFlights.has(flightId) ||
            savingFlights.has(flightId) ||
            isDuplicateBookingId()
        )
            return;

        setSavingFlights((prev) => new Set(prev).add(flightId));

        try {
            const flightInfo = flightData.flights[0];
            // this refers to last item and will be needed especially if there are layovers
            const lastFlight = flightData.flights.at(-1);

            // get airport details by IATA
            const depAirport = await getAirportByIATA(
                flightInfo.departure_airport.airport_code
            );
            console.log("Departure Airport", depAirport);

            const arrAirport = await getAirportByIATA(
                lastFlight.arrival_airport.airport_code
            );
            console.log("Arrival Airport", arrAirport);

            const saveRecord = {
                fields: {
                    // based on form data
                    bookingID: generateBookingId(),
                    dep: [depAirport.id],
                    arr: [arrAirport.id],

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
                console.error("Airtable Error:", errorData);
                throw new Error(`Airtable Error: ${errorData.error?.message}`);
            }

            setSavedFlights((prev) => new Set(prev).add(flightId));
        } catch (err) {
            setError(err.message);
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
        error,
    };
};

export default useSavedFlights;
