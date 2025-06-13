// src/components/Flights/FlightsList.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import formatDataStructure from "@/utils/formatDataStructure";

import flights from "@/data/flights.json";

import { Collapsible, Flex, Mark, SimpleGrid, Text } from "@chakra-ui/react";

const FlightsList = ({ searchFormData }) => {
    // initialize allFlights as an empty array by default
    let allFlights = [];

    allFlights = formatDataStructure(flights);

    // use the save flight hook to post data
    const { savedFlights, savingFlights, error, saveFlight } =
        useSavedFlights(searchFormData) || {};

    return (
        <>
            {/* to show error message from fetching if any */}
            {error && <Text color="red.500">{error}</Text>}

            {allFlights.length > 0 ? (
                <Collapsible.Root defaultOpen>
                    <Collapsible.Trigger paddingY="3">
                        Flight List Toggle View
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                        <Flex gap={5} flexDirection="column" mt="20px">
                            <Text>
                                There are{" "}
                                <Mark variant="solid">{allFlights.length} flight(s)</Mark>{" "}
                                 found.
                            </Text>

                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                {allFlights.map((flight, id) => {
                                    const flightId = flight.booking_token || id;
                                    const isLoading =
                                        savingFlights.has(flightId);
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
                        </Flex>
                    </Collapsible.Content>
                </Collapsible.Root>
            ) : (
                <p>No flight found.</p>
            )}
        </>
    );
};

export default FlightsList;
