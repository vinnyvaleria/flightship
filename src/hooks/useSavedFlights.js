// src/hooks/useSavedFlights.js

import useSavedFlightsContext from "./useSavedFlightsContext";
import formatDate from "@/utils/formatDate";
import getAirportByIATA from "@/utils/getAirportByIATA";
import getSavedFlightByID from "@/utils/getSavedFlightByID";

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = "appE7UVuI3rqrgzNd";
const TABLE_ID = "tblZcUyPOWsIIBLJA";
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Custom hook to fetch saved flights from Airtable.
 * @param {Array} searchFormData The search form data as array
 */

const useSavedFlights = (searchFormData) => {
    // get state from context
    const {
        savedFlights,
        setSavedFlights,
        savingFlights,
        setSavingFlights,
        error,
        setError,
    } = useSavedFlightsContext();

    // split booking id generation as a separate function
    const generateBookingId = () => {
        return `${searchFormData?.bookingId}_${searchFormData?.departureIATA}_${searchFormData?.arrivalIATA}`;
    };

    // check if the booking id and itinerary submitted is duplicated
    const isDuplicateBookingId = async () => {
        const bookingID = generateBookingId();

        // check for any local duplicates
        // technically this is not required since button is disabled after save
        const isLocalDuplicated = Array.from(savedFlights).some((savedId) =>
            savedId.includes(bookingID)
        );

        if (isLocalDuplicated) {
            setError("There is an existing record found locally!");
            return true;
        }

        // check in airtable if bookingID exists
        try {
            // console.log("bookingID :", bookingID);
            let airtableData = await getSavedFlightByID(bookingID);

            if (airtableData.records.length > 0) {
                setError(
                    "There is an existing record found in with the same bookingID and routes!"
                );
                return true;
            }
        } catch (err) {
            setError("Error checking for duplicate records: " + err.message);
            return true;
        }

        // if none of the conditions met
        return false;
    };

    const saveFlight = async (flightData) => {
        // clear existing errors
        setError(null);

        // use the available booking token from API return
        const flightId = flightData.booking_token;

        if (savedFlights.has(flightId) || savingFlights.has(flightId)) return;

        setSavingFlights((prev) => new Set(prev).add(flightId));

        try {
            // check for any duplicates
            const isDuplicate = await isDuplicateBookingId();
            if (isDuplicate) return;

            const flightInfo = flightData.flights[0];
            // this refers to last item and will be needed especially if there are layovers
            const lastFlight = flightData.flights.at(-1);

            // get airport details by IATA
            const depAirport = await getAirportByIATA(
                flightInfo.departure_airport.airport_code
            );
            // console.log("Departure Airport", depAirport);

            const arrAirport = await getAirportByIATA(
                lastFlight.arrival_airport.airport_code
            );
            // console.log("Arrival Airport", arrAirport);

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

                    dep_date: formatDate(
                        flightInfo.departure_airport.time,
                        "iso"
                    ),
                    dep_time: flightInfo.departure_airport.time,
                    arr_date: formatDate(
                        lastFlight.arrival_airport.time,
                        "iso"
                    ),
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
        savedFlights,
        savingFlights,
        error,
        saveFlight,
    };
};

export default useSavedFlights;
