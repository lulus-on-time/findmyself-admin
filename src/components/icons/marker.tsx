"use-client";

import L from "leaflet";

export const accessPointIcon = L.icon({
  iconUrl: "/icons/router.svg",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  tooltipAnchor: [10, 0],
});

export const spaceLabelIcon = (spaceName: string | null) =>
  new L.DivIcon({
    className: "my-div-icon",
    html: `<div style="display:flex; gap:4px; align-items:start"><img alt="marker" src="/icons/poi-marker.svg" /><span>${spaceName}</span></div>`,
    iconAnchor: [8, 12],
  });
