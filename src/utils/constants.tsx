"use-client";

import L from "leaflet";

export var apIcon = L.icon({
  iconUrl: "/images/wifi.svg",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  tooltipAnchor: [10, 0],
});

export var labelIcon = (roomName: string | null) =>
  new L.DivIcon({
    className: "my-div-icon",
    html: `<div style="display:flex; gap:4px; align-items:start"><img alt="marker" src="/images/marker.svg" /><span>${roomName}</span></div>`,
    iconAnchor: [8, 12],
  });
