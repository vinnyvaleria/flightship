"use client";

import { useState } from "react";
import { Button, Input, Stack, Field } from "@chakra-ui/react";

const FlightSearch = () => {
    // state variable to store search term
    const [flightSearchTerm, setFlightSearchTerm] = useState([
        {
            bookingId: "",
            departureDate: "",
            origin: "",
            destination: "",
            apiKey: "",
        },
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
                    <Field.Root>
                        <Field.Label>Booking Number</Field.Label>
                        <Input
                            id="bookingId"
                            name="bookingId"
                            value={flightSearchTerm.bookingId}
                            onChange={handleInputChange}
                            variant="subtle"
                            placeholder="Enter booking number"
                            required
                        />
                        <Field.ErrorText>
                            This field is required
                        </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Departure date</Field.Label>
                        <Input
                            id="departureDate"
                            name="departureDate"
                            value={flightSearchTerm.departureDate}
                            onChange={handleInputChange}
                            variant="subtle"
                            type="date"
                            placeholder="Enter departure date"
                            required
                        />
                        <Field.ErrorText>
                            This field is required
                        </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Origin City</Field.Label>
                        <Input
                            id="origin"
                            name="origin"
                            value={flightSearchTerm.origin}
                            onChange={handleInputChange}
                            variant="subtle"
                            placeholder="Enter flight origin"
                            required
                        />
                        <Field.ErrorText>
                            This field is required
                        </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Destination City</Field.Label>
                        <Input
                            id="destination"
                            name="destination"
                            value={flightSearchTerm.destination}
                            onChange={handleInputChange}
                            variant="subtle"
                            placeholder="Enter flight destination"
                            required
                        />
                        <Field.ErrorText>
                            This field is required
                        </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>API Key</Field.Label>
                        <Input
                            id="apiKey"
                            name="apiKey"
                            value={flightSearchTerm.apiKey}
                            onChange={handleInputChange}
                            variant="subtle"
                            placeholder="Enter your api key"
                            required
                        />
                        <Field.ErrorText>
                            This field is required
                        </Field.ErrorText>
                    </Field.Root>
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
