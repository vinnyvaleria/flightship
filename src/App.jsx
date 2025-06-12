// src/App.jsx

import NavBar from "./components/NavBar/NavBar";

import FlightSearch from "./components/Flights/FlightSearch";
import FlightsList from "./components/Flights/FlightsList";
import SavedFlightsList from "./components/Flights/SavedFlightsList";
import FlightDetails from "./components/Flights/FlightDetails";
import SavedFlightsProvider from "./contexts/SavedFlightsProvider";

import * as flightScheduledService from "./services/flightScheduleService";

import { useState } from "react";
import { Route, Routes } from "react-router-dom";

const App = () => {
    // state variable for list of flights saved based on search
    const [flightsData, setFlightsData] = useState([]);
    const [displayedFlights, setDisplayedFlights] = useState([]);

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

    // store submitted search
    const [submittedSearchData, setSubmittedSearchData] = useState(null);
    const temporaryFormData = {
        bookingId: "BEI233",
        departureDate: "2025-06-26",
        departure: "Singapore - Singapore Changi Airport (SIN)",
        departureIATA: "SIN",
        arrival: "Sydney - Sydney Kingsford Smith International Airport (SYD)",
        arrivalIATA: "SYD",
        apiKey: "This is test only",
    };

    // since API is fetch asynchronously, display Loading if needed
    const [fLoading, setFLoading] = useState(true);

    // function to fetch API data
    const fetchFlightsData = async (formData) => {
        try {
            setFLoading(true);

            const fData = await flightScheduledService.show(
                formData.departureDate,
                formData.departureIATA,
                formData.arrivalIATA,
                formData.apiKey
            );

            setFlightsData(fData);
            setDisplayedFlights(fData);
            setFLoading(false);

            // save submitted search data only when fetch is successful
            setSubmittedSearchData(formData);

            // reset form - on success
            setNewFlightSearch({
                bookingId: "",
                departureDate: "",
                departure: "",
                departureIATA: "",
                arrival: "",
                arrivalIATA: "",
                apiKey: "",
            });

            // return success for status check at flight search submission
            return { success: true };
        } catch (err) {
            setFLoading(false);

            // return error info
            return {
                success: false,
                error: err.message || "Failed to fetch flights",
            };
        }
    };

    return (
        <>
            <NavBar />
            <SavedFlightsProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <main>
                                <FlightSearch
                                    newFlightSearch={newFlightSearch}
                                    setNewFlightSearch={setNewFlightSearch}
                                    fetch={fetchFlightsData}
                                />
                                {/* <FlightsList searchFormData={submittedSearchData} /> */}
                                {displayedFlights && (
                                    <FlightsList
                                        // flights={displayedFlights}
                                        searchFormData={temporaryFormData}
                                    />
                                )}
                            </main>
                        }
                    />

                    <Route
                        path="/saved-flights"
                        element={
                            <SavedFlightsList
                                searchFormData={temporaryFormData}
                            />
                        }
                    />

                    <Route
                        path="/saved-flights/:booking_id"
                        element={<FlightDetails />}
                    />
                </Routes>
            </SavedFlightsProvider>
        </>
    );
};

export default App;
