// src/components/Flights/FlightSearch.jsx

import SearchInput from "../SearchInput/SearchInput";
import useAirportSuggestions from "@/hooks/useAirportSuggestions";

import { useState } from "react";
import { Button, Stack, Text } from "@chakra-ui/react";

const FlightSearch = ({ newFlightSearch, setNewFlightSearch, fetch }) => {
    // state to control when to show suggestions
    const [showSuggestions, setShowSuggestions] = useState({
        departure: true,
        arrival: true,
    });

    // add loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewFlightSearch({
            ...newFlightSearch,
            [name]: value,
        });

        // clear error when user starts typing
        if (submitError) setSubmitError(null);

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
        const iata =
            fieldName === "departure" ? "departureIATA" : "arrivalIATA";

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

    const handleSubmit = async (event) => {
        // stopping the default form submission action
        event.preventDefault();

        // prevent multiple submissions
        if (isSubmitting) return;

        // clear any previous error
        setSubmitError(null);

        // do not store empty input or whitespace
        if (
            !newFlightSearch.bookingId.trim() ||
            !newFlightSearch.apiKey.trim() ||
            !newFlightSearch.departure.trim() ||
            !newFlightSearch.arrival.trim() ||
            !newFlightSearch.departureDate.trim()
        ) {
            setSubmitError("Please fill in all required fields");
            return;
        }

        // set the current submit state after previous checks
        setIsSubmitting(true);

        try {
            // fetch data on submit - await the result
            const fetchData = await fetch(newFlightSearch);

            if (fetchData.success) {
                // reset show suggestion - on success
                setShowSuggestions({
                    departure: true,
                    arrival: true,
                });
            } else {
                // set the error message received
                setSubmitError(fetchData.error);
            }
        } catch (err) {
            // handle unexpected errors
            setSubmitError(err.message || "An unexpected error occurred");
        } finally {
            // once all cases are handled
            setIsSubmitting(false);
        }
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
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Searching Flights..." : "Submit"}
                    </Button>

                    {/* error text below button if fetch fails */}
                    {submitError && <Text color="red.500">{submitError}</Text>}
                </Stack>
            </form>
        </>
    );
};

export default FlightSearch;
