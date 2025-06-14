// src/utils/formatUTCOffset.js

function formatUTCOffset(offset) {
    const sign = offset >= 0 ? "+" : "-";
    const absolute = Math.abs(offset);
    const hours = Math.floor(absolute);
    const minutes = Math.round((absolute - hours) * 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${sign}${hh}:${mm}`;
}

export default formatUTCOffset;
