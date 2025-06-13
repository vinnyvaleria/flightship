// src/contexts/SavedFlightsProvider.jsx

import { createContext, useState } from "react";

// create context for saved flights state
const SavedFlightsContext = createContext();

const SavedFlightsProvider = ({ children }) => {
    // Lifted saved flights states (from useSavedFlights hook)
    const [flightRecords, setFlightRecords] = useState([]);
    const [savedFlights, setSavedFlights] = useState(new Set());
    const [savingFlights, setSavingFlights] = useState(new Set());
    const [deletingFlights, setDeletingFlights] = useState(new Set());

    // state for processing
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const value = {
        flightRecords,
        setFlightRecords,
        savedFlights,
        setSavedFlights,
        savingFlights,
        setSavingFlights,
        deletingFlights,
        setDeletingFlights,
        error,
        setError,
        loading,
        setLoading,
    };

    return (
        <SavedFlightsContext.Provider value={value}>
            {children}
        </SavedFlightsContext.Provider>
    );
};

export default SavedFlightsProvider;
export { SavedFlightsContext };
