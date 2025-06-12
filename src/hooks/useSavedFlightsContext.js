// src/hooks/useSavedFlightsContext.js

import { SavedFlightsContext } from "../contexts/SavedFlightsProvider";

import { useContext } from "react";

const useSavedFlightsContext = () => {
    // retrieves the current context value
    const context = useContext(SavedFlightsContext);

    if (!context) {
        throw new Error(
            "useSavedFlightsContext must be used within SavedFlightsProvider"
        );
    }

    // return context so components encapsulated by this can use the context
    return context;
};

export default useSavedFlightsContext;
