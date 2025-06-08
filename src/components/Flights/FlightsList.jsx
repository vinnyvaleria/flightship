import FlightsDetails from "./FlightDetails";

const FlightsList = ({ flights }) => {
    return flights.map((flight) => {
        <FlightsDetails flights={flight} />;
    });
};

export default FlightsList;
