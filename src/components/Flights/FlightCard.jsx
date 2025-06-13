// src/components/Flights/FlightCard.jsx

import formatDate from "@/utils/formatDate";
import formatTimeToString from "@/utils/formatTimetoString";

import {
    Card,
    Avatar,
    Button,
    Text,
    Flex,
    Box,
    Badge,
    Blockquote,
    Float,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import WeatherFlex from "../Weather/WeatherFlex";

const FlightCard = ({
    weatherData,
    flightData,
    onSaveFlight,
    onDeleteFlight,
    isLoading = false,
    isSaved = false,
    isDeleted = false,
    error = false,
    custom = false,
}) => {
    // store the list of flights
    const flightInfo = flightData.flights[0];
    const lastFlight = flightData.flights[flightData.flights.length - 1];

    // display details of layovers if any
    const isDirect = flightData.stops === 0;
    const hasLayover = flightData.layovers && flightData.layovers.length > 0;

    const navigate = useNavigate();

    const handleViewMore = () => {
        const bookingId = flightData.booking_id;
        if (bookingId) {
            navigate(`/saved-flights/${bookingId}`);
        }
    };

    return (
        <Card.Root
            variant="elevated"
            w={custom ? "unset" : "480px"}
            maxW={custom ? "550px" : "inherit"}
        >
            <Card.Body p="5">
                {/* Booking id */}
                {flightData.booking_id && !custom && (
                    <Badge
                        colorPalette="pink"
                        size="lg"
                        w="fit-content"
                        minW="100px"
                        mb={3}
                    >
                        {flightData.booking_id}
                    </Badge>
                )}

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
                <Box mt={3}>
                    <Flex justify="space-between" align="stretch" mb="4">
                        {/* Departure Info */}
                        <Box textAlign="left" flex="1">
                            {weatherData && (
                                <WeatherFlex {...weatherData.departure[0]} />
                            )}
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
                                    height="3px"
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
                        <Box textAlign="right" flex="1" justifyItems="flex-end">
                            {weatherData && (
                                <WeatherFlex {...weatherData.arrival[0]} />
                            )}
                            <Text fontSize="2xl" fontWeight="bold" mb="1">
                                {formatTimeToString(
                                    lastFlight.arrival_airport.time
                                )}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" mb="1">
                                {lastFlight.arrival_airport.airport_code}
                            </Text>
                            <Text fontSize="xs" color="gray.600" mb="1">
                                {lastFlight.arrival_airport.airport_name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {formatDate(
                                    lastFlight.arrival_airport.time,
                                    "string"
                                )}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Layover Info */}
                    {hasLayover &&
                        flightData.layovers.map((layover, index) => {
                            return (
                                <Box
                                    key={index}
                                    bg="gray.500"
                                    p="3"
                                    borderRadius="md"
                                    color="black"
                                    textAlign="center"
                                >
                                    <Text fontSize="sm">
                                        <Text as="span" fontWeight="bold">
                                            {layover.duration_label} Layover :
                                        </Text>{" "}
                                        {layover.city}
                                    </Text>
                                    <Text as="span" fontSize="xs">
                                        {layover.airport_name} (
                                        {layover.airport_code})
                                    </Text>
                                </Box>
                            );
                        })}

                    {flightData.message && weatherData && (
                        <Blockquote.Root
                            variant="plain"
                            colorPalette="pink"
                            color="lightpink"
                            mt={5}
                        >
                            <Float
                                placement="top-start"
                                offsetY="2"
                                offsetX="2"
                            >
                                <Blockquote.Icon />
                            </Float>
                            <Blockquote.Content ml={2}>
                                {flightData.message}
                            </Blockquote.Content>
                        </Blockquote.Root>
                    )}
                </Box>
            </Card.Body>

            <Card.Footer
                pt="4"
                borderTop="1px solid"
                borderColor="gray.800"
                display="block"
            >
                {/*  Action buttons */}
                <Flex justifyContent="flex-end" alignItems="center">
                    {onSaveFlight && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSaveFlight(flightData)}
                            loading={isLoading}
                            loadingText="Saving..."
                            disabled={isSaved || error}
                            cursor={
                                isSaved || error ? "not-allowed" : "pointer"
                            }
                        >
                            Save Flight
                        </Button>
                    )}
                    {onDeleteFlight && (
                        <Flex gap={3}>
                            {!custom && (
                                <Button
                                    variant="surface"
                                    size="sm"
                                    colorPalette="pink"
                                    onClick={handleViewMore}
                                >
                                    View More
                                </Button>
                            )}

                            {weatherData &&
                                (flightData.message ? (
                                    <Button
                                        variant="surface"
                                        size="sm"
                                        colorPalette="pink"
                                    >
                                        Edit Message
                                    </Button>
                                ) : (
                                    <Button
                                        variant="surface"
                                        size="sm"
                                        colorPalette="pink"
                                    >
                                        Add Message
                                    </Button>
                                ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onDeleteFlight(flightData.booking_id)
                                }
                                loading={isLoading}
                                disabled={isDeleted || error}
                                loadingText="Deleting..."
                            >
                                Delete Flight
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Card.Footer>
        </Card.Root>
    );
};

export default FlightCard;
