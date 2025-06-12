// src/components/Flights/FlightsList.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";

import flights from "@/data/flights.json";

import { SimpleGrid, Text } from "@chakra-ui/react";

const FlightsList = ({ searchFormData }) => {
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
    const { savedFlights, savingFlights, saveFlight, error } =
        useSavedFlights(searchFormData) || {};

    return (
        <>
            <p>{allFlights?.length} flights found.</p>

            {/* to show error message from fetching if any */}
            {error && <Text color="red.500">{error}</Text>}

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {allFlights.map((flight, id) => {
                    const flightId = flight.booking_token || id;
                    const isLoading = savingFlights.has(flightId);
                    const isSaved = savedFlights.has(flightId);

                    return (
                        <FlightCard
                            key={flightId}
                            flightData={flight}
                            onSaveFlight={saveFlight}
                            isLoading={isLoading}
                            isSaved={isSaved}
                            error={error}
                        />
                    );
                })}
            </SimpleGrid>
        </>
    );
};

export default FlightsList;
