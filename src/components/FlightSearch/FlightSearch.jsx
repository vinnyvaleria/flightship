import SearchInput from "../SearchInput/SearchInput";

import { useState } from "react";
import { Button, Input, Stack, Field } from "@chakra-ui/react";
import useCitySuggestions from "@/hooks/useCitySuggestions";

const FlightSearch = () => {
    // state variable to store search term
    const [newFlightSearch, setNewFlightSearch] = useState({
        bookingId: "",
        departureDate: "",
        departureCity: "",
        arrivalCity: "",
        apiKey: "",
    });

    const handleInputChange = (event) => {
        setNewFlightSearch({
            ...newFlightSearch,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        // stopping the default form submission action
        event.preventDefault();

        // do not store empty input or whitespace
        if (!newFlightSearch.bookingId.trim() || !newFlightSearch.apiKey.trim())
            return;

        // reset form
        setNewFlightSearch([
            {
                bookingId: "",
                departureDate: "",
                departureCity: "",
                arrivalCity: "",
                apiKey: "",
            },
        ]);
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
                        name="departureDate"
                        value={newFlightSearch.departureDate}
                        onChange={handleInputChange}
                    />

                    <SearchInput
                        label="origin city"
                        name="departureCity"
                        value={newFlightSearch.departureCity}
                        onChange={handleInputChange}
                        suggestions={depSuggestions}
                        loading={depLoading}
                        error={depError}
                    />

                    <SearchInput
                        label="destination city"
                        name="arrivalCity"
                        value={newFlightSearch.arrivalCity}
                        onChange={handleInputChange}
                        suggestions={arrSuggestions}
                        loading={arrLoading}
                        error={arrError}
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
                        required
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default FlightSearch;
