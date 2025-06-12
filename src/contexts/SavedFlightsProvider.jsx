// src/contexts/SavedFlightsProvider.jsx
import { createContext } from "react";
import useSavedFlights from "../hooks/useSavedFlights";

// create context for saved flights state
const SavedFlightsContext = createContext();

const SavedFlightsProvider = ({ children, searchFormData }) => {
    const savedFlightsHook = useSavedFlights(searchFormData);

    return (
        <SavedFlightsContext.Provider value={savedFlightsHook}>
            {children}
        </SavedFlightsContext.Provider>
    );
};

export default SavedFlightsProvider;
export { SavedFlightsContext };
