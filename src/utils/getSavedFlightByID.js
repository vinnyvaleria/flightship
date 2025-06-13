// src/utils/getSavedFlightByID.js

const getSavedFlightByID = async (bookingID) => {
    const AIRTABLE_URL = "https://api.airtable.com/v0";
    const BASE_ID = "appE7UVuI3rqrgzNd";
    const TABLE_ID = "tblZcUyPOWsIIBLJA";
    const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

    // if empty, return none
    if (!bookingID) return null;
    // console.log("bookingID :", bookingID);

    const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?filterByFormula=SEARCH("${bookingID}", booking_id)`;

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok)
            throw new Error("Failed to fetch saved flight by booking_id.");

        const data = await res.json();

        // console.log("getSavedFlightByID data:", data.records.length, data);
        // since booking_id is the primary field, only need the first item
        return data;
    } catch (error) {
        // console.error("getSavedFlightByID error:", error);
        return null;
    }
};

export default getSavedFlightByID;
