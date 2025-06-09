// src/components/Flights/FlightDetails.jsx

import { Card, Avatar, Button, Text, Badge, Flex, Box } from "@chakra-ui/react";

const FlightDetails = ({ flightData }) => {
    // function to format time
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // function to format date
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // store the list of topFlights
    const flightInfo = flightData.flights[0];

    return (
        <>
            <Card.Root variant="elevated" minW="500px">
                <Card.Body gap="30px">
                    {/* Airline Header */}
                    <Flex align="center" gap="3">
                        <Avatar.Root size="md" shape="rounded">
                            <Avatar.Image src={flightData.airline_logo} />
                            <Avatar.Fallback name={flightInfo.airline} />
                        </Avatar.Root>
                        <Box>
                            <Card.Title fontSize="lg">
                                {flightInfo.airline}
                            </Card.Title>
                            <Text fontSize="sm" color="gray.600">
                                {/* add condition for multiple flights */}
                                {flightData.flights
                                    .map(
                                        (f) =>
                                            `${f.flight_number} (${f.aircraft})`
                                    )
                                    .join(" ➔ ")}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Flight Time Info */}
                    <Box>
                        <Flex justify="space-between" align="center" mb="2">
                            <Box textAlign="center">
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatTime(
                                        flightInfo.departure_airport.time
                                    )}
                                </Text>
                                <Text fontSize="sm">
                                    {flightInfo.departure_airport.airport_name}{" "}
                                    ({flightInfo.departure_airport.airport_code}
                                    )
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    {formatDate(
                                        flightInfo.departure_airport.time
                                    )}
                                </Text>
                            </Box>

                            <Box textAlign="center" flex="1" m="0 10px">
                                <Text fontSize="sm" color="yellow.400">
                                    — {flightData.duration.text} —
                                </Text>
                            </Box>

                            <Box textAlign="center">
                                <Text fontSize="xl" fontWeight="bold">
                                    {/* use length - 1 in case there is layover */}
                                    {formatTime(
                                        flightData.flights[
                                            flightData.flights.length - 1
                                        ].arrival_airport.time
                                    )}
                                </Text>
                                <Text fontSize="sm">
                                    {
                                        flightData.flights[
                                            flightData.flights.length - 1
                                        ].arrival_airport.airport_name
                                    }{" "}
                                    (
                                    {
                                        flightData.flights[
                                            flightData.flights.length - 1
                                        ].arrival_airport.airport_code
                                    }
                                    )
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    {formatDate(
                                        flightData.flights[
                                            flightData.flights.length - 1
                                        ].arrival_airport.time
                                    )}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </Card.Body>

                <Card.Footer justifyContent="flex-end" gap="2">
                    <Button variant="outline" size="sm">
                        Save Flight
                    </Button>
                </Card.Footer>
            </Card.Root>
        </>
    );
};

export default FlightDetails;
