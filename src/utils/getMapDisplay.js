// src/utils/getMapDisplay.js

import Leaflet from "leaflet";

// L.map(<HTMLElement> el, <Map options> options?)
// coordinates = [latitude, longitude]
const getMapDisplay = (mapElementId, coordinates = []) => {
    if (!mapElementId) {
        console.error("Map container not found.");
        return;
    }

    // prevent double init if map was already created
    if (mapElementId._leaflet_id) {
        mapElementId._leaflet_id = null; // reset if needed
    }

    // https://leafletjs.com/examples/quick-start/
    // sets the view of the map (geographical center and zoom) with the given animation options
    // setView(<LatLng> center, <Number> zoom, <Zoom/pan options> options?)
    const map = Leaflet.map(mapElementId).setView([0, 0], 2);

    // used to load and display tile layers on the map
    // https://leafletjs.com/reference.html#tilelayer-option
    Leaflet.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 10,
        }
    ).addTo(map);

    if (coordinates.length > 0) {
        // add map markers
        coordinates.forEach(([lat, lng]) => {
            Leaflet.marker([lat, lng]).addTo(map);
        });

        // draw polyline (route)
        const routeLine = Leaflet.polyline(coordinates, {
            color: "pink",
        }).addTo(map);
        map.fitBounds(routeLine.getBounds());
    }

    return map;
};

export default getMapDisplay;
