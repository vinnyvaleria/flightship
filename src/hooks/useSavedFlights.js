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
        flightRecords,
        setFlightRecords,
        savedFlights,
        setSavedFlights,
        savingFlights,
        setSavingFlights,
        deletingFlights,
        setDeletingFlights,
        updatingFlights,
        setUpdatingFlights,
        error,
        setError,
        loading,
        setLoading,
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

            // console.log("Saved Flight data based on booking id:", airtableData);

            if (airtableData.records.length > 0) {
                setError(
                    "There is an existing record found in with the same booking_id and routes!"
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

    // fetch existing records in Saved Flights table
    const getFlights = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to fetch saved flights.");

            const data = await res.json();
            // console.log("Saved Flights data :", data);

            setFlightRecords(data);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // function to save flight upon button click on flight card
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
                    booking_id: generateBookingId(),
                    booking_token: flightData.booking_token,
                    dep: [depAirport.id],
                    arr: [arrAirport.id],

                    // based on api response and displayed
                    airline: flightInfo.airline,
                    airline_logo: flightInfo.airline_logo,
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
                // console.error("Airtable Error:", errorData);
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

    // function to delete flight
    // https://airtable.com/developers/web/api/delete-record
    const deleteFlight = async (bookingID) => {
        // clear existing errors
        setError(null);

        const airtableData = await getSavedFlightByID(bookingID);
        const recordId = airtableData.records[0].id;
        // console.log("Deleting record ID :", recordId);

        // if the booking id is found in the deleting flights array, return nothing
        if (deletingFlights.has(recordId)) return;

        // set the list of deleted flights
        setDeletingFlights((prev) => new Set(prev).add(recordId));

        try {
            const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}/${recordId}`;

            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                // console.error("Airtable Error:", errorData);
                throw new Error(`Airtable Error: ${errorData.error?.message}`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            // always stop loading state
            setDeletingFlights((prev) => {
                const updated = new Set(prev);
                updated.delete(recordId);
                return updated;
            });
        }

        // console.log("Flight Records :", flightRecords);
        // update flightRecords state
        setFlightRecords((prev) => ({
            ...prev,
            records: prev.records.filter((record) => record.id !== recordId),
        }));
    };

    // update message function
    const updateFlightMessage = async (bookingID, message) => {
        // clear existing errors
        setError(null);

        let recordId;

        try {
            const airtableData = await getSavedFlightByID(bookingID);

            // check if record exists
            if (!airtableData.records || airtableData.records.length === 0) {
                throw new Error(
                    `No record found with booking ID: ${bookingID}`
                );
            }

            recordId = airtableData.records[0].id;
            // console.log("Updating record ID :", recordId);

            // if the booking id is found in the updating flights array, return nothing
            if (updatingFlights.has(recordId)) return;

            // set the list of updating flights
            setUpdatingFlights((prev) => new Set(prev).add(recordId));

            const existingMessage = airtableData.records[0].fields?.message;
            // console.log("Existing message available? ", existingMessage);

            // added new field last_updated in airtable
            const updateRecord = {
                fields: {
                    message,
                    last_updated: new Date().toISOString(),
                },
            };

            const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}/${recordId}`;

            const res = await fetch(url, {
                method: existingMessage === undefined ? "PATCH" : "POST",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateRecord),
            });

            if (!res.ok) {
                const errorData = await res.json();
                // console.error("Airtable Error:", errorData);
                throw new Error(`Airtable Error: ${errorData.error?.message}`);
            }

            const updatedRecord = await res.json();
            // console.log("Successfully updated record:", updatedRecord);

            // update flight records
            setFlightRecords((prev) => ({
                ...prev,
                records: prev.records.map((record) =>
                    record.id === recordId ? updatedRecord : record
                ),
            }));

            return updatedRecord;
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingFlights((prev) => {
                const updated = new Set(prev);
                updated.delete(recordId);
                return updated;
            });
        }
    };

    return {
        flightRecords,
        savedFlights,
        savingFlights,
        deletingFlights,
        error,
        loading,
        getFlights,
        saveFlight,
        deleteFlight,
        updateFlightMessage,
    };
};

export default useSavedFlights;
