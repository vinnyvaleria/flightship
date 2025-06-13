// src/components/Flights/FlightsList.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import formatDataStructure from "@/utils/formatDataStructure";

import flights from "@/data/flights.json";

import { SimpleGrid, Text } from "@chakra-ui/react";

const FlightsList = ({ searchFormData }) => {
    // initialize allFlights as an empty array by default
    let allFlights = [];

    allFlights = formatDataStructure(flights);

    // use the save flight hook to post data
    const { savedFlights, savingFlights, error, saveFlight } =
        useSavedFlights(searchFormData) || {};

    return (
        <>
            {allFlights.length > 0 ? (
                <p>{allFlights.length} flight(s) found.</p>
            ) : (
                <p>No flight found.</p>
            )}

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
