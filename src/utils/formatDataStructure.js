// src/utils/formatDataStructure.js

import transformAirtableData from "./transformAirtableData";

/**
 * Determines if the data is from Airtable or Flight API
 * @param {Object} flightData - The data object
 * @returns {string} - 'airtable' or 'flightapi'
 */

const formatDataStructure = (flightData) => {
    // airtable
    if (flightData.records && Array.isArray(flightData.records)) {
        const allFlights = flightData.records.map((record) =>
            transformAirtableData(record)
        );
        console.log("Format Airtable data :", allFlights);

        return allFlights[0];
    }

    // flight api
    if (flightData.data && flightData.data.itineraries) {
        // available data from json file to use
        const topFlights = flightData.data.itineraries.topFlights;
        const otherFlights = flightData.data.itineraries.otherFlights;

        // combine available flights data
        const allFlights = [...topFlights, ...otherFlights];
        // console.log("Format Flight API data :", allFlights);

        return allFlights;
    }

    // data structure already transformed
    if (flightData.flights && Array.isArray(flightData.flights)) {
        console.log("No format required :", [flightData]);
        return [flightData]; // Already normalized
    }

    console.warn("Unknown data source format");
    return [];
};

export default formatDataStructure;
