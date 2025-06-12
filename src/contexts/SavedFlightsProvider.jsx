// src/contexts/SavedFlightsProvider.jsx
import { createContext, useState } from "react";

// create context for saved flights state
const SavedFlightsContext = createContext();

const SavedFlightsProvider = ({ children }) => {
    // Lifted saved flights states (from useSavedFlights hook)
    const [savedFlights, setSavedFlights] = useState(new Set());
    const [savingFlights, setSavingFlights] = useState(new Set());

    const value = {
        savedFlights,
        setSavedFlights,
        savingFlights,
        setSavingFlights,
    };

    return (
        <SavedFlightsContext.Provider value={value}>
            {children}
        </SavedFlightsContext.Provider>
    );
};

export default SavedFlightsProvider;
export { SavedFlightsContext };
