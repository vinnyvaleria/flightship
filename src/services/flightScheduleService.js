// src/services/flightApi.js

const BASE_URL = "https://google-flights2.p.rapidapi.com/api/v1";
const SEARCH_ID = "searchFlights";

const show = async (departureDate, departureIATA, arrivalIATA, apiKey) => {
    const url = `${BASE_URL}/${SEARCH_ID}?departure_id=${departureIATA}&arrival_id=${arrivalIATA}&outbound_date=${departureDate}`;
    const res = await fetch(url, {
        headers: {
            "X-Rapidapi-Key": apiKey,
            "X-Rapidapi-Host": "google-flights2.p.rapidapi.com",
            Host: "google-flights2.p.rapidapi.com",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch flights.");

    const data = await res.json();
    return data;
};

export { show };
