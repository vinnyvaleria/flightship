// src/components/FlightSearch/FlightSearch.jsx

import SearchInput from "../SearchInput/SearchInput";
import useAirportSuggestions from "@/hooks/useAirportSuggestions";

import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";

const FlightSearch = () => {
    // state variable to store search term
    const [newFlightSearch, setNewFlightSearch] = useState({
        bookingId: "",
        departureDate: "",
        departure: "",
        departureIATA: "",
        arrival: "",
        arrivalIATA: "",
        apiKey: "",
    });

    // state to control when to show suggestions
    const [showSuggestions, setShowSuggestions] = useState({
        departure: true,
        arrival: true,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewFlightSearch({
            ...newFlightSearch,
            [name]: value,
        });

        // show suggestions when user is typing and has not selected any suggestion
        if (name === "departure" || name === "arrival") {
            setShowSuggestions((prev) => ({
                ...prev,
                [name]: true,
            }));
        }
    };

    // handle when user click on one of the suggestions
    const handleSuggestionClick = (selectedSuggestion, fieldName) => {
        // Use the displayText from the suggestion object
        const iata = fieldName === "departure" ? "departureIATA" : "arrivalIATA";

        setNewFlightSearch((prev) => ({
            ...prev,
            [fieldName]: selectedSuggestion.displayText,
            [iata]: selectedSuggestion.iataCode,
        }));

        // hide suggestion when one of the lists is clicked
        setShowSuggestions((prev) => {
            const newSuggestionState = {
                ...prev,
                [fieldName]: false,
            };
            // console.log("New showSuggestions state:", newSuggestionState);
            return newSuggestionState;
        });
    };

    const handleSubmit = (event) => {
        // stopping the default form submission action
        event.preventDefault();

        // do not store empty input or whitespace
        if (
            !newFlightSearch.bookingId.trim() ||
            !newFlightSearch.apiKey.trim() ||
            !newFlightSearch.departure.trim() ||
            !newFlightSearch.arrival.trim() ||
            !newFlightSearch.departureDate.trim()
        ) {
            alert("Please fill in all required fields");
            return;
        }

        // reset form
        setNewFlightSearch({
            bookingId: "",
            departureDate: "",
            departure: "",
            departureIATA: "",
            arrival: "",
            arrivalIATA: "",
            apiKey: "",
        });

        // reset show suggestion
        setShowSuggestions({
            departure: true,
            arrival: true,
        });
    };

    // fetch suggestions
    const {
        suggestions: depSuggestions = [],
        loading: depLoading = false,
        error: depError = null,
    } = useAirportSuggestions(newFlightSearch.departure) || {};

    const {
        suggestions: arrSuggestions = [],
        loading: arrLoading = false,
        error: arrError = null,
    } = useAirportSuggestions(newFlightSearch.arrival) || {};

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack gap="4">
                    <SearchInput
                        label="booking number"
                        name="bookingId"
                        value={newFlightSearch.bookingId}
                        onChange={handleInputChange}
                    />

                    <SearchInput
                        label="flight date"
                        type="date"
                        name="departureDate"
                        value={newFlightSearch.departureDate}
                        onChange={handleInputChange}
                    />

                    <SearchInput
                        label="origin"
                        name="departure"
                        value={newFlightSearch.departure}
                        onChange={handleInputChange}
                        suggestions={
                            showSuggestions.departure ? depSuggestions : ""
                        }
                        loading={depLoading}
                        error={depError}
                        onSuggestionClick={handleSuggestionClick}
                        showSuggestions={showSuggestions.departure}
                    />

                    <SearchInput
                        label="destination"
                        name="arrival"
                        value={newFlightSearch.arrival}
                        onChange={handleInputChange}
                        suggestions={
                            showSuggestions.arrival ? arrSuggestions : ""
                        }
                        loading={arrLoading}
                        error={arrError}
                        onSuggestionClick={handleSuggestionClick}
                        showSuggestions={showSuggestions.arrival}
                    />

                    <SearchInput
                        label="Enter you API Key"
                        name="apiKey"
                        value={newFlightSearch.apiKey}
                        onChange={handleInputChange}
                    />

                    <Button
                        type="submit"
                        bg="bg.subtle"
                        variant="outline"
                        colorPalette="gray"
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default FlightSearch;
