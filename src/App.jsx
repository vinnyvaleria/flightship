// src/App.jsx

import NavBar from "./components/NavBar/NavBar";

import FlightsList from "./components/FlightsList/FlightsList";
import FlightsDetails from "./components/FlightsDetails/FlightDetails";
import FlightSearch from "./components/FlightSearch/FlightSearch";

import * as flightScheduledService from "./services/flightScheduleService";

import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

const App = () => {
    // state variable for list of flights saved based on search
    const [flightsData, setFlightsData] = useState([]);
    const [displayedFlights, setDisplayedFlights] = useState([]);

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

            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <FlightSearch fetch={fetchFlightsData} />
                        </main>
                    }
                />

                <Route path="/saved-flights" element={<FlightsList />} />

                <Route
                    path="/saved-flights:bookingId"
                    element={<FlightsDetails />}
                />
            </Routes>
        </>
    );
};

export default App;
