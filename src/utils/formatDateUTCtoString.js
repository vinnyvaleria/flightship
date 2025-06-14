// src/utils/formatDateUTCtoString.js

const formatDateUTCtoString = (timestring) => {
    if (typeof timestring !== "string") {
        return [{ date: "-", time: "-" }];
    }

    let utcDate;

    // detect iso format like "2025-06-26T02:00:00.000Z"
    if (timestring.includes("T")) {
        utcDate = new Date(timestring);
    }
    // detect simple date-time format like "2025-6-27 05:55"
    else if (timestring.includes("-") && timestring.includes(":")) {
        const [datePart, timePart] = timestring.split(" ");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);

        utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    }
    // unsupported format
    else {
        return [{ date: "-", time: "-" }];
    }

    // format time as "hh:mm am/pm"
    let hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const paddedHour = hours.toString().padStart(2, "0");
    const displayTime = `${paddedHour}:${minutes} ${ampm}`;

    // format date as "mon dd, yyyy"
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const formattedDate = `${
        months[utcDate.getUTCMonth()]
    } ${utcDate.getUTCDate()}, ${utcDate.getUTCFullYear()}`;

    return [{ date: formattedDate, time: displayTime }];
};

export default formatDateUTCtoString;
