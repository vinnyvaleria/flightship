import NavBar from "./components/NavBar/NavBar";

import { Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <>
            <NavBar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <h1>Homepage</h1>
                        </main>
                    }
                />
                <Route path="/saved-flights" element={<h1>Saved Flights</h1>} />

                <Route
                    path="/saved-flights:bookingId"
                    element={<h1>Saved Flights</h1>}
                />
            </Routes>
        </>
    );
};

export default App;
