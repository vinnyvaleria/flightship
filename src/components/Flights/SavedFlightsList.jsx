// src/components/Flights/SavedFlightsList.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import formatDataStructure from "@/utils/formatDataStructure";

import {
    Flex,
    Heading,
    Highlight,
    Mark,
    SimpleGrid,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect } from "react";

const SavedFlightsList = () => {
    // use the save flight hook to get data
    const {
        flightRecords,
        deletingFlights,
        error,
        loading,
        getFlights,
        deleteFlight,
    } = useSavedFlights() || {};

    const allFlights = formatDataStructure(flightRecords);

    // ensure allFlights is an array for mapping
    const flightsToRender = Array.isArray(allFlights) ? allFlights : [];

    // fetch all flights when compoent mounts
    useEffect(() => {
        if (getFlights) {
            getFlights();
        }
    }, []); // empty dependency array to run only once

    if (loading) return <Spinner size="sm" />;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <>
            <Heading as="h3">
                <Highlight
                    query={["saved flights"]}
                    styles={{ px: "0.5", bg: "teal.muted" }}
                >
                    You are currently viwing your saved flights!
                </Highlight>
            </Heading>

            {flightsToRender.length > 0 && (
                <Flex gap={5} mt="20px" flexDirection="column">
                    <Text>
                        There are{" "}
                        <Mark variant="solid">
                            {flightsToRender?.length} flight(s)
                        </Mark>{" "}
                        found.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                        {flightsToRender.map((flight, id) => {
                            const flightId = flight.booking_id || id;
                            const isLoading =
                                flightId && deletingFlights.has(flightId);
                            const isDeleted = false;

                            return (
                                <FlightCard
                                    key={flightId}
                                    flightData={flight}
                                    onDeleteFlight={deleteFlight}
                                    isLoading={isLoading}
                                    isDeleted={isDeleted}
                                    error={error}
                                />
                            );
                        })}
                    </SimpleGrid>
                </Flex>
            )}

            {!loading && flightsToRender.length === 0 && (
                <Text>No flight found.</Text>
            )}
        </>
    );
};

export default SavedFlightsList;
