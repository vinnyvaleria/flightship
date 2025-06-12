// src/utils/formatTimeToString.js

// function to format time
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
const formatTimeToString = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export default formatTimeToString;
