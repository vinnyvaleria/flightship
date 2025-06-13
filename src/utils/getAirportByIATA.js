// src/utils/getAirportByIATA.js

const getAirportByIATA = async (iata) => {
    const AIRTABLE_URL = "https://api.airtable.com/v0";
    const BASE_ID = "appE7UVuI3rqrgzNd";
    const TABLE_ID = "tbl6yKWKSNtTDI6o2";
    const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

    // if empty, return none
    if (!iata) return null;

    const url = `${AIRTABLE_URL}/${BASE_ID}/${TABLE_ID}?filterByFormula=SEARCH("${iata}", iata)`;

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch airport by IATA.");

        const data = await res.json();

        // console.log("getAirportByIATA data:", data);
        // since iata is the primary field, only need the first item
        return data.records[0] || null;
    } catch (error) {
        // console.error("getAirportByIATA error:", error);
        return null;
    }
};

export default getAirportByIATA;
