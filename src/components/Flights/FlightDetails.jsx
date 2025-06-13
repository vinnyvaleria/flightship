// src/components/Flights/FlightDetails.jsx

import FlightCard from "./FlightCard";
import useSavedFlights from "@/hooks/useSavedFlights";
import useWeatherForecast from "@/hooks/useWeatherForecast";
import getAirportByIATA from "@/utils/getAirportByIATA";
import getSavedFlightByID from "@/utils/getSavedFlightByID";
import formatDataStructure from "@/utils/formatDataStructure";
import getMapDisplay from "@/utils/getMapDisplay";

import { Box, Button, Text, Badge, Flex } from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const FlightDetails = () => {
    // use params based on the current booking_id
    // the const here must align with the route path
    const { booking_id } = useParams();
    // console.log("Booking ID from URL :", booking_id);

    // page navigation
    const navigate = useNavigate();

    // store map data
    const mapRef = useRef(null);

    // state variable for flight detail
    const [flightDetail, setFlightDetail] = useState(null);

    // state for locations (city names for weather API)
    const [locations, setLocations] = useState({
        departure: null,
        arrival: null,
    });

    const { flightRecords, error, loading, getFlights, deleteFlight } =
        useSavedFlights() || {};

    // weather hooks for each location - only call when locations are available
    const departureWeather = useWeatherForecast(locations.departure);
    const arrivalWeather = useWeatherForecast(locations.arrival);

    // weather data to pass in to FlightCard
    const weatherData = {
        departure: [{ location: locations.departure, ...departureWeather }],
        arrival: [{ location: locations.arrival, ...arrivalWeather }],
    };
    // console.log("Weather data after combined :", weatherData);

    // retrieve coordinates and city name of all flights within the route
    const retrieveFlightData = async () => {
        // get each flight stop coordinates
        let allCoordinates = [];
        // get each flight city name
        let flightLocations = {
            departure: null,
            arrival: null,
        };

        const data = await getSavedFlightByID(booking_id);
        const flightData = data.records[0];
        // console.log("getSavedFLightByID data:", flightData);

        const departure = await getAirportByIATA(flightData.fields.dep_iata);
        flightLocations.departure = departure.fields.city;
        allCoordinates.push([
            departure.fields.latitude,
            departure.fields.longtitude,
        ]);

        // loop for more than one layover if any
        if (flightData.fields.hasLayover) {
            const layoverDetails = JSON.parse(
                flightData.fields.layover_details
            );

            await Promise.all(
                layoverDetails.map(async (layover) => {
                    const temp = await getAirportByIATA(layover.airportCode);
                    // console.log("Tempory constant for layover :", temp);
                    allCoordinates.push([
                        temp.fields.latitude,
                        temp.fields.longtitude,
                    ]);
                })
            );
        }

        const arrival = await getAirportByIATA(flightData.fields.arr_iata);
        flightLocations.arrival = arrival.fields.city;
        allCoordinates.push([
            arrival.fields.latitude,
            arrival.fields.longtitude,
        ]);
        // console.log("Arrival Coordinates :", arrCoordinates);

        // console.log("All coordinates array :", allCoordinates);

        setLocations(flightLocations);
        return allCoordinates;
    };

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

            const loadMapAndLocations = async () => {
                const allCoordinates = await retrieveFlightData();
                getMapDisplay(mapRef.current, allCoordinates);
            };
            loadMapAndLocations();
        }
    }, [flightRecords, booking_id]); // dependent to flight records state and booking_id

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
            {/* Booking number */}
            <Badge
                colorPalette="pink"
                size="lg"
                w="fit-content"
                minW="100px"
                mb={3}
            >
                {flightDetail.booking_id}
            </Badge>

            {/* Map display */}
            <Flex
                id="flightMap"
                ref={mapRef}
                bg="gray.100"
                borderRadius="6px"
                height="500px"
                width="100%"
            ></Flex>

            {/* Flight card */}
            <FlightCard
                flightData={flightDetail}
                custom={true}
                onDeleteFlight={handleDelete}
                weatherData={weatherData}
            />
        </>
    );
};

export default FlightDetails;
