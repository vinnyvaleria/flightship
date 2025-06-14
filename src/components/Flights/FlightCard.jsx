// src/components/Flights/FlightCard.jsx

import formatDateUTCtoString from "@/utils/formatDateUTCtoString";
import WeatherFlex from "../Weather/WeatherFlex";
import FlightMessage from "./FlightMessage";

import { Card, Avatar, Button, Text, Flex, Box, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
    onUpdateMessage,
    isEditing,
    onEditingMessage,
    message,
    setMessage,
}) => {
    // store the list of flights
    const flightInfo = flightData.flights[0];
    const lastFlight = flightData.flights[flightData.flights.length - 1];

    // display details of layovers if any
    const isDirect = flightData.stops === 0;
    const hasLayover = flightData.layovers && flightData.layovers.length > 0;

    // displat time after converting
    // console.log("Departure time :", flightInfo.departure_airport.time);
    const [{ date: depDate, time: depTime }] = formatDateUTCtoString(
        flightInfo.departure_airport.time
    );
    // console.log("Departure date and time", depDate, depTime);

    // console.log("Arrival time :", lastFlight.arrival_airport.time);
    const [{ date: arrDate, time: arrTime }] = formatDateUTCtoString(
        lastFlight.arrival_airport.time
    );
    // console.log("Arrival date and time", arrDate, arrTime);

    const navigate = useNavigate();

    const handleViewMore = () => {
        const bookingId = flightData.booking_id;
        if (bookingId) {
            navigate(`/saved-flights/${bookingId}`);
        }
    };

    const handleAddMessage = () => {
        onEditingMessage(true);
        setMessage("");
    };

    const handleEditMessage = () => {
        onEditingMessage(true);
    };

    const handleSaveMessage = () => {
        if (onUpdateMessage && message.trim()) {
            onUpdateMessage(flightData.booking_id, message.trim());
            onEditingMessage(false);
        }
    };

    return (
        <Card.Root variant="elevated" maxW={custom ? "550px" : "inherit"}>
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
                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                mb="1"
                                whiteSpace="nowrap"
                            >
                                {depTime}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" mb="1">
                                {flightInfo.departure_airport.airport_code}
                            </Text>
                            <Text fontSize="xs" color="gray.600" mb="1">
                                {flightInfo.departure_airport.airport_name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {depDate}
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
                            <Text
                                fontSize={{ base: "10px", sm: "xs", md: "sm" }}
                                color="gray.600"
                                mb="2"
                            >
                                {flightData.duration.text}
                            </Text>
                            <Box position="relative" mb="2">
                                <Box
                                    height={{ base: "1px", md: "33px" }}
                                    bg="gray.300"
                                    position="relative"
                                >
                                    {/* Departure dot */}
                                    <Box
                                        position="absolute"
                                        left="0"
                                        top={{ base: "-2px", md: "-3px" }}
                                        w={{ base: "5px", md: "8px" }}
                                        h={{ base: "5px", md: "8px" }}
                                        bg="blue.500"
                                        borderRadius="full"
                                    />
                                    {/* Arrival dot */}
                                    <Box
                                        position="absolute"
                                        right="0"
                                        top={{ base: "-2px", md: "-3px" }}
                                        w={{ base: "5px", md: "8px" }}
                                        h={{ base: "5px", md: "8px" }}
                                        bg="green.500"
                                        borderRadius="full"
                                    />
                                </Box>
                            </Box>
                            {!isDirect && (
                                <Text
                                    fontSize={{ base: "10px", md: "xs" }}
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
                                    fontSize={{ base: "10px", md: "xs" }}
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
                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                mb="1"
                                whiteSpace="nowrap"
                            >
                                {arrTime}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" mb="1">
                                {lastFlight.arrival_airport.airport_code}
                            </Text>
                            <Text fontSize="xs" color="gray.600" mb="1">
                                {lastFlight.arrival_airport.airport_name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {arrDate}
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

                    {weatherData && (
                        <FlightMessage
                            isEditing={isEditing}
                            onEditingMessage={onEditingMessage}
                            message={message}
                            setMessage={setMessage}
                        />
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

                            {weatherData && (
                                <>
                                    {isEditing ? (
                                        <Button
                                            variant="surface"
                                            size="sm"
                                            colorPalette="pink"
                                            onClick={handleSaveMessage}
                                            disabled={!message.trim()}
                                        >
                                            Save Message
                                        </Button>
                                    ) : message ? (
                                        <Button
                                            variant="surface"
                                            size="sm"
                                            colorPalette="pink"
                                            onClick={handleEditMessage}
                                        >
                                            Edit Message
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="surface"
                                            size="sm"
                                            colorPalette="pink"
                                            onClick={handleAddMessage}
                                        >
                                            Add Message
                                        </Button>
                                    )}
                                </>
                            )}

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
