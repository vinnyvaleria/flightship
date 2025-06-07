// src/components/FlightSearch/FlightSearch.jsx

import SearchInput from "../SearchInput/SearchInput";
import useCitySuggestions from "@/hooks/useCitySuggestions";

import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";

const FlightSearch = () => {
    // state variable to store search term
    const [newFlightSearch, setNewFlightSearch] = useState({
        bookingId: "",
        departureDate: "",
        departureCity: "",
        arrivalCity: "",
        apiKey: "",
    });

    // state to control when to show suggestions
    const [showSuggestions, setShowSuggestions] = useState({
        departureCity: true,
        arrivalCity: true,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewFlightSearch({
            ...newFlightSearch,
            [name]: value,
        });

        // show suggestions when user is typing and has not selected any suggestion
        if (name === "departureCity" || name === "arrivalCity") {
            setShowSuggestions((prev) => ({
                ...prev,
                [name]: true,
            }));
        }
    };

    // handle when user click on one of the suggestions
    const handleSuggestionClick = (selectedCity, fieldName) => {
        // console.log("Before click - showSuggestions:", showSuggestions);
        // console.log("Selected city:", selectedCity, "Field:", fieldName);

        setNewFlightSearch((prev) => ({
            ...prev,
            [fieldName]: selectedCity,
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
        if (!newFlightSearch.bookingId.trim() || !newFlightSearch.apiKey.trim())
            return;

        // reset form
        setNewFlightSearch({
            bookingId: "",
            departureDate: "",
            departureCity: "",
            arrivalCity: "",
            apiKey: "",
        });

        // reset show suggestion
        setShowSuggestions({
            departureCity: true,
            arrivalCity: true,
        });
    };

    // fetch suggestions
    const {
        suggestions: depSuggestions,
        loading: depLoading,
        error: depError,
    } = useCitySuggestions(newFlightSearch.departureCity);

    const {
        suggestions: arrSuggestions,
        loading: arrLoading,
        error: arrError,
    } = useCitySuggestions(newFlightSearch.arrivalCity);

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
                        label="origin city"
                        name="departureCity"
                        value={newFlightSearch.departureCity}
                        onChange={handleInputChange}
                        suggestions={
                            showSuggestions.departureCity ? depSuggestions : ""
                        }
                        loading={depLoading}
                        error={depError}
                        onSuggestionClick={handleSuggestionClick}
                        showSuggestions={showSuggestions.departureCity}
                    />

                    <SearchInput
                        label="destination city"
                        name="arrivalCity"
                        value={newFlightSearch.arrivalCity}
                        onChange={handleInputChange}
                        suggestions={
                            showSuggestions.arrivalCity ? arrSuggestions : ""
                        }
                        loading={arrLoading}
                        error={arrError}
                        onSuggestionClick={handleSuggestionClick}
                        showSuggestions={showSuggestions.arrivalCity}
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
