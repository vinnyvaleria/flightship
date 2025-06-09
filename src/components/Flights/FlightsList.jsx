// src/components/Flights/FlightsList.jsx

import { SimpleGrid } from "@chakra-ui/react";
import FlightsDetails from "./FlightCard";

import flights from "@/data/flights.json";

const FlightsList = () => {
    // available data from json file to use
    const topFlights = flights.data.itineraries.topFlights;
    const otherFlights = flights.data.itineraries.otherFlights;

    // combine available flights data
    const allFlights = [...topFlights, ...otherFlights];

    return (
        <>
            <p>{allFlights.length} flights found.</p>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {allFlights.map((flight, id) => (
                    <FlightsDetails
                        key={flight.booking_token || id}
                        flightData={flight}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

export default FlightsList;
