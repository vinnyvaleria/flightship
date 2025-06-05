import { useState } from "react";
import FlightsList from "./components/FlightsList/FlightsList";
import NavBar from "./components/NavBar/NavBar";

import { Route, Routes } from "react-router-dom";
import FlightsDetails from "./components/FlightsDetails/FlightDetails";
import FlightSearch from "./components/FlightSearch/FlightSearch";

const App = () => {
    // state variable for list of flights saved based on search
    const [flights, setFlights] = useState([]);

    return (
        <>
            <NavBar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <FlightSearch />
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
