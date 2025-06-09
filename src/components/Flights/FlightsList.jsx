// src/components/Flights/FlightsList.jsx

import FlightsDetails from "./FlightCard";
import useSaveFlight from "@/hooks/useSaveFlight";

// import flights from "@/data/flights.json";

import { SimpleGrid } from "@chakra-ui/react";

const FlightsList = ({ flights, searchFormData }) => {
    // initialize allFlights as an empty array by default
    let allFlights = [];

    if (flights && flights.data?.itineraries) {
        // available data from json file to use
        const topFlights = flights.data.itineraries.topFlights;
        const otherFlights = flights.data.itineraries.otherFlights;

        // combine available flights data
        allFlights = [...topFlights, ...otherFlights];
    }

    // use the save flight hook to post data
    const { saveFlight, savedFlights, savingFlights } =
        useSaveFlight(searchFormData) || {};

    return (
        <>
            <p>{allFlights?.length} flights found.</p>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {allFlights.map((flight, id) => (
                    <FlightsDetails
                        key={flight.booking_token || id}
                        flightData={flight}
                        onSaveFlight={saveFlight}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

export default FlightsList;
