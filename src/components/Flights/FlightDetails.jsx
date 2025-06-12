// src/components/Flights/FlightDetails.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import formatDataStructure from "@/utils/formatDataStructure";

import { Box, Button, Text, Badge } from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FlightDetails = () => {
    // use params based on the current booking_id
    // the const here must align with the route path
    const { booking_id } = useParams();
    // console.log("Booking ID from URL :", booking_id);

    const navigate = useNavigate();

    // state variable for flight detail
    const [flightDetail, setFlightDetail] = useState(null);

    const { flightRecords, error, loading, getFlights, deleteFlight } =
        useSavedFlights() || {};

    useEffect(() => {
        if (getFlights) {
            getFlights();
        }
    }, []); // empty dependency array to run only once

    useEffect(() => {
        if (flightRecords && booking_id) {
            const allFlights = formatDataStructure(flightRecords);
            // console.log("Formatted flights:", allFlights);
            // console.log("booking_id param:", booking_id);

            const flight = allFlights.find((f) => f.booking_id === booking_id);
            setFlightDetail(flight);
            // console.log("Flight detail state:", flightDetail);
        }
    }, [flightRecords, booking_id]); // dependent to flight records state and booking_id

    // when flight is deleted, go back to saved flights
    const handleDelete = async () => {
        if (flightDetail && deleteFlight) {
            await deleteFlight(flightDetail.booking_id);
            navigate("/saved-flights");
        }
    };

    const handleBack = () => {
        navigate("/saved-flights");
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text color="red.500">{error}</Text>;

    if (!flightDetail) {
        return (
            <Box textAlign="center" py={8}>
                <Text>Flight not found</Text>
                <Button mt={4} onClick={handleBack}>
                    Back to Saved Flights
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Badge
                colorPalette="pink"
                size="lg"
                w="fit-content"
                minW="100px"
                mb={3}
            >
                {flightDetail.booking_id}
            </Badge>

            <FlightCard
                flightData={flightDetail}
                custom={true}
                onDeleteFlight={handleDelete}
            />
        </>
    );
};

export default FlightDetails;
