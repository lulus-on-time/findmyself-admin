"use client";

import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const SimpleMap = () => {
  const mapRef = useRef(null);
  const latitude = 51.505;
  const longitude = -0.09;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white text-black">
      {/* Make sure you set the height and width of the map container otherwise
      the map won't show */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={20}
        ref={mapRef}
        style={{ height: "80vh", width: "80vw" }}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Additional map layers or components can be added here */}
        <Marker
          position={[latitude, longitude]}
          icon={
            new Icon({
              iconUrl: "/images/marker.svg",
              iconSize: [50, 50],
              iconAnchor: [25, 0],
            })
          }
        >
          <Popup>Ruang A3.05</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SimpleMap;
