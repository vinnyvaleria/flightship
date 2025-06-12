// src/components/Flights/FlightCard.jsx

import formatDate from "@/utils/formatDate";
import formatTimeToString from "@/utils/formatTimetoString";

import { Card, Avatar, Button, Text, Flex, Box } from "@chakra-ui/react";

const FlightCard = ({
    flightData,
    onSaveFlight,
    isLoading = false,
    isSaved = false,
    error = false,
}) => {
    // store the list of topFlights
    const flightInfo = flightData.flights[0];

    // display details of layovers if any
    const isDirect = flightData.stops === 0;
    const hasLayover = flightData.layovers && flightData.layovers.length > 0;

    return (
        <Card.Root variant="elevated" w="500px">
            <Card.Body p="6">
                {/* Airline Header */}
                <Flex align="center" gap="3" mb="6">
                    <Avatar.Root size="md" shape="rounded">
                        <Avatar.Image src={flightData.airline_logo} />
                        <Avatar.Fallback name={flightInfo.airline} />
                    </Avatar.Root>
                    <Box>
                        <Card.Title fontSize="lg" mb="1">
                            {flightInfo.airline}
                        </Card.Title>
                        <Text fontSize="sm" color="gray.600">
                            {/* add condition for multiple flights */}
                            {flightData.flights
                                .map(
                                    (f) => `${f.flight_number} (${f.aircraft})`
                                )
                                .join(" ➔ ")}
                        </Text>
                    </Box>
                </Flex>

                {/* Flight Time Info */}
                <Box>
                    <Flex justify="space-between" align="stretch" mb="4">
                        {/* Departure Info */}
                        <Box textAlign="left" flex="1">
                            <Text fontSize="2xl" fontWeight="bold" mb="1">
                                {formatTimeToString(
                                    flightInfo.departure_airport.time
                                )}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" mb="1">
                                {flightInfo.departure_airport.airport_code}
                            </Text>
                            <Text fontSize="xs" color="gray.600" mb="1">
                                {flightInfo.departure_airport.airport_name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {formatDate(
                                    flightInfo.departure_airport.time,
                                    "string"
                                )}
                            </Text>
                        </Box>

                        {/* Duration and Flight Path */}
                        <Box
                            textAlign="center"
                            flex="1"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            px="4"
                        >
                            <Text fontSize="sm" color="gray.600" mb="2">
                                {flightData.duration.text}
                            </Text>
                            <Box position="relative" mb="2">
                                <Box
                                    height="2px"
                                    bg="gray.300"
                                    position="relative"
                                >
                                    {/* Departure dot */}
                                    <Box
                                        position="absolute"
                                        left="0"
                                        top="-3px"
                                        w="8px"
                                        h="8px"
                                        bg="blue.500"
                                        borderRadius="full"
                                    />
                                    {/* Arrival dot */}
                                    <Box
                                        position="absolute"
                                        right="0"
                                        top="-3px"
                                        w="8px"
                                        h="8px"
                                        bg="green.500"
                                        borderRadius="full"
                                    />
                                </Box>
                            </Box>
                            {!isDirect && (
                                <Text
                                    fontSize="xs"
                                    color="orange.500"
                                    fontWeight="medium"
                                >
                                    {`${flightData.stops} ${
                                        flightData.stops === 1
                                            ? "stop"
                                            : "stops"
                                    }`}
                                </Text>
                            )}
                            {isDirect && (
                                <Text
                                    fontSize="xs"
                                    color="green.600"
                                    fontWeight="medium"
                                >
                                    Direct flight
                                </Text>
                            )}
                        </Box>

                        {/* Arrival Info */}
                        <Box textAlign="right" flex="1">
                            <Text fontSize="2xl" fontWeight="bold" mb="1">
                                {formatTimeToString(
                                    flightData.flights[
                                        flightData.flights.length - 1
                                    ].arrival_airport.time
                                )}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" mb="1">
                                {
                                    flightData.flights[
                                        flightData.flights.length - 1
                                    ].arrival_airport.airport_code
                                }
                            </Text>
                            <Text fontSize="xs" color="gray.600" mb="1">
                                {
                                    flightData.flights[
                                        flightData.flights.length - 1
                                    ].arrival_airport.airport_name
                                }
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {formatDate(
                                    flightData.flights[
                                        flightData.flights.length - 1
                                    ].arrival_airport.time,
                                    "string"
                                )}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Layover Info */}
                    {hasLayover && (
                        <Box
                            bg="gray.500"
                            p="3"
                            borderRadius="md"
                            color="black"
                            textAlign="center"
                        >
                            <Text fontSize="sm">
                                <Text as="span" fontWeight="bold">
                                    {flightData.layovers[0].duration_label}{" "}
                                    Layover :
                                </Text>{" "}
                                {flightData.layovers[0].city}
                            </Text>
                            <Text as="span" fontSize="xs">
                                {flightData.layovers[0].airport_name} (
                                {flightData.layovers[0].airport_code})
                            </Text>
                        </Box>
                    )}
                </Box>
            </Card.Body>

            <Card.Footer
                pt="4"
                borderTop="1px solid"
                borderColor="gray.800"
                display="block"
            >
                <Flex justifyContent="flex-end" alignItems="center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSaveFlight(flightData)}
                        loading={isLoading}
                        loadingText="Saving..."
                        disabled={isSaved || error}
                        cursor={isSaved || error ? "not-allowed" : "pointer"}
                    >
                        Save Flight
                    </Button>
                </Flex>
            </Card.Footer>
        </Card.Root>
    );
};

export default FlightCard;
