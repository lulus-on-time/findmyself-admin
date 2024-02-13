"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";

const ManualMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if map instance already exists
    // @ts-ignore
    if (!mapRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 1,
      });

      var bounds = [
        [0, 0],
        [577, 1204],
      ];
      // @ts-ignore
      var image = L.imageOverlay("/images/maps.png", bounds).addTo(map);
      // @ts-ignore
      map.fitBounds(bounds);

      var marker = L.marker([577 - 100, 150], {
        icon: new Icon({
          iconUrl: "/images/marker.svg",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      var marker2 = L.marker([577 - 200, 300], {
        icon: new Icon({
          iconUrl: "/images/wifi.svg",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
      marker2.bindPopup("Hello, I'm access point 1").openPopup();

      var marker3 = L.marker([577 - 100, 400], {
        icon: new Icon({
          iconUrl: "/images/wifi.svg",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
      marker3.bindPopup("Hello, I'm access point 2").openPopup();
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white text-black">
      <div
        id="map"
        style={{ height: "577px", width: "1204px" }}
        ref={mapRef}
      ></div>
    </div>
  );
};

export default ManualMap;
