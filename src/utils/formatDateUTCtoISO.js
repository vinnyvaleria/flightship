// src/utils/formatDateUTCtoISO.js

import formatUTCOffset from "./formatUTCOffset";

const formatDateUTCtoISO = (timestring, utc) => {
    // split date and time
    const [datePart, timePart] = timestring.split(" ");

    // split and pad date with 0 in front if needed for month and date
    const [year, month, day] = datePart
        .split("-")
        .map((n) => n.padStart(2, "0"));

    // split and pad time
    const [hour, minute] = timePart.split(":").map((n) => n.padStart(2, "0"));

    // format utc from example 8 to +08:00
    const offset = formatUTCOffset(utc);

    // combine all
    const combined = `${year}-${month}-${day}T${hour}:${minute}:00${offset}`;

    // create Date object (automatically parsed into UTC)
    const date = new Date(combined);
    // console.log("After passing in formatted date to Date:", date);

    // validate
    if (isNaN(date)) {
        console.error("Invalid date generated:", combined);
        return null;
    }

    // return UTC ISO string
    return date.toISOString(); // e.g., "2025-10-05T11:45:00.000Z"
};

export default formatDateUTCtoISO;
