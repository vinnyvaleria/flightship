// src/utils/transformAirtableData.js

/**
 * Transforms Airtable flight data to match the expected FlightCard structure
 * @param {Object} airtableRecord - The Airtable record
 * @returns {Object} - Normalized flight data
 */

const transformAirtableData = (airtableRecord) => {
    const fields = airtableRecord.fields;

    // parse flight numbers from JSON string (handle escaped quotes)
    let flightNumbers = [];
    try {
        flightNumbers = JSON.parse(fields.flight_numbers || "[]");
    } catch (error) {
        // console.warn("Error parsing flight_numbers:", error);
        // Fallback: create a single flight entry if parsing fails
        flightNumbers = [
            {
                flightNumber: "N/A",
                aircraft: "N/A",
            },
        ];
    }

    // parse layover details from JSON string (handle escaped quotes)
    let layoverDetails = [];
    try {
        layoverDetails = JSON.parse(fields.layover_details || "[]");
    } catch (error) {
        // console.warn("Error parsing layover_details:", error);
        layoverDetails = [];
    }

    // create flights array
    const flights = flightNumbers.map((flight, index) => ({
        booking_token: fields.booking_token,
        booking_id: fields.booking_id,
        airline: fields.airline,
        flight_number: flight.flightNumber,
        aircraft: flight.aircraft,
        departure_airport: {
            time: fields.dep_time,
            airport_code: index === 0 ? fields.dep_iata[0] : null,
            airport_name: index === 0 ? fields.dep_airport[0] : null,
        },
        arrival_airport: {
            time: index === flightNumbers.length - 1 ? fields.arr_time : null,
            airport_code:
                index === flightNumbers.length - 1 ? fields.arr_iata[0] : null,
            airport_name:
                index === flightNumbers.length - 1
                    ? fields.arr_airport[0]
                    : null,
        },
    }));

    // create normalized structure
    return {
        booking_token: fields.booking_token,
        booking_id: fields.booking_id,
        flights: flights,
        stops: fields.stops || 0,
        duration: {
            text: fields.duration,
        },
        airline_logo: fields.airline_logo,
        layovers: layoverDetails.map((layover) => ({
            duration_label: layover.duration,
            city: layover.city,
            airport_name: layover.airportName,
            airport_code: layover.airportCode,
        })),
        message: fields.message,
    };
};

export default transformAirtableData;
