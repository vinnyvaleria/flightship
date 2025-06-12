// src/utils/getArrows.js

import L from "leaflet";

// https://stackoverflow.com/questions/53307322/leaflet-polyline-arrows

function getArrows(arrLatlngs, color, arrowCount, mapObj) {
    if (
        typeof arrLatlngs === "undefined" ||
        arrLatlngs == null ||
        !arrLatlngs.length ||
        arrLatlngs.length < 2
    )
        return [];

    if (typeof arrowCount === "undefined" || arrowCount == null) arrowCount = 1;

    if (typeof color === "undefined" || color == null) color = "";
    else color = "color:" + color;

    var result = [];
    for (var i = 1; i < arrLatlngs.length; i++) {
        var icon = L.divIcon({
            className: "arrow-icon",
            iconSize: [20, 20],
            iconAnchor: [10, 8], // centers the icon
            bgPos: [5, 5],
            html: `<div style="${color}; transform: rotate(${getAngle(
                arrLatlngs[i - 1],
                arrLatlngs[i],
                -1
            )}deg); transform-origin: center;">▶</div>`,
        });
        for (var c = 1; c <= arrowCount; c++) {
            const positionRatio = arrowCount === 1 ? 0.5 : c / (arrowCount + 1);
            result.push(
                L.marker(
                    myMidPoint(
                        arrLatlngs[i],
                        arrLatlngs[i - 1],
                        positionRatio,
                        mapObj
                    ),
                    { icon: icon }
                )
            );
        }
    }
    return result;
}

function getAngle(latLng1, latlng2, coef) {
    var dy = latlng2[0] - latLng1[0];
    var dx = Math.cos((Math.PI / 180) * latLng1[0]) * (latlng2[1] - latLng1[1]);
    var ang = (Math.atan2(dy, dx) / Math.PI) * 180 * coef;
    return ang.toFixed(2);
}

function myMidPoint(latlng1, latlng2, per, mapObj) {
    if (!mapObj) throw new Error("map is not defined");

    var halfDist,
        dist,
        p1,
        p2,
        ratio = [];

    p1 = mapObj.project(new L.latLng(latlng1));
    p2 = mapObj.project(new L.latLng(latlng2));

    halfDist = distanceTo(p1, p2) * per;

    if (halfDist === 0) return mapObj.unproject(p1);

    dist = distanceTo(p1, p2);

    if (dist > halfDist) {
        ratio = (dist - halfDist) / dist;
        var res = mapObj.unproject(
            new Point(
                p2.x - ratio * (p2.x - p1.x),
                p2.y - ratio * (p2.y - p1.y)
            )
        );
        return [res.lat, res.lng];
    }
}

function distanceTo(p1, p2) {
    var x = p2.x - p1.x,
        y = p2.y - p1.y;

    return Math.sqrt(x * x + y * y);
}

function Point(x, y, round) {
    this.x = round ? Math.round(x) : x;
    this.y = round ? Math.round(y) : y;
}

export default getArrows;
