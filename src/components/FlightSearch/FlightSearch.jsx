"use client";

import { useState } from "react";
import { Button, Input, Group, Stack } from "@chakra-ui/react";

const FlightSearch = () => {
    // state variable to store search term
    const [flightSearchTerm, setFlightSearchTerm] = useState([
        { bookingId: "", apiKey: "" },
    ]);

    const handleInputChange = (event) => {
        setFlightSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        // stopping the default form submission action
        event.preventDefault();

        // do not store empty input or whitespace
        if (!flightSearchTerm.trim()) return;

        // reset the newBook state to its initial empty values to clear the form fields, preparing them for the next entry
        setFlightSearchTerm("");
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack gap="4">
                    <Input
                        id="bookingId"
                        name="bookingId"
                        value={flightSearchTerm.bookingId}
                        onChange={handleInputChange}
                        variant="subtle"
                        placeholder="Enter booking number"
                    />
                    <Input
                        id="apiKey"
                        name="apiKey"
                        value={flightSearchTerm.apiKey}
                        onChange={handleInputChange}
                        variant="subtle"
                        placeholder="Enter your api key"
                    />
                    <Button
                        type="submit"
                        bg="bg.subtle"
                        variant="outline"
                        colorPalette="gray"
                    >
                        Submit
                    </Button>{" "}
                </Stack>
            </form>
        </>
    );
};

export default FlightSearch;
