// src/components/Flights/SavedFlightsList.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import formatDataStructure from "@/utils/formatDataStructure";

import { SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect } from "react";

const SavedFlightsList = ({ searchFormData }) => {
    // use the save flight hook to get data
    const {
        flightRecords,
        savedFlights,
        savingFlights,
        error,
        loading,
        getFlights,
        saveFlight,
    } = useSavedFlights(searchFormData) || {};

    const allFlights = formatDataStructure(flightRecords);

    // ensure allFlights is an array for mapping
    const flightsToRender = Array.isArray(allFlights) ? allFlights : [];

    // fetch all flights when compoent mounts
    useEffect(() => {
        if (getFlights) {
            getFlights();
        }
    }, []); // empty dependency array to run only once

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <>
            {flightsToRender.length > 0 && (
                <p>{flightsToRender?.length} flights found.</p>
            )}

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {flightsToRender.map((flight, id) => {
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

            {!loading && flightsToRender.length === 0 && (
                <Text>No flights found.</Text>
            )}
        </>
    );
};

export default SavedFlightsList;
