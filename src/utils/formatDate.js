// src/utils/formatDateToString.js

// function to format date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
const formatDate = (timeString, format) => {
    const date = new Date(timeString);

    if (format === "iso") {
        return date.toISOString().split("T")[0]; // ISO short format
    } else if (format === "string") {
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
};

export default formatDate;
