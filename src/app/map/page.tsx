"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";

const ManualMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // @ts-ignore
    if (!mapRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
      });

      var bounds = [
        [0, 0],
        [577, 1204],
      ];

      // @ts-ignore
      var image = L.imageOverlay("/images/maps2.png", bounds).addTo(map);
      // @ts-ignore
      map.fitBounds(bounds);

      var roomGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Auditorium" },
            geometry: {
              type: "Point",
              coordinates: [150, 577 - 125],
            },
          },
          {
            type: "Feature",
            properties: { name: "Lab Komputer A3.01" },
            geometry: {
              type: "Point",
              coordinates: [400, 577 - 100],
            },
          },
          {
            type: "Feature",
            properties: { name: "Kelas A3.05" },
            geometry: {
              type: "Point",
              coordinates: [850, 577 - 440],
            },
          },
          {
            type: "Feature",
            properties: { name: "Void" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [1002, 0.166667],
                  [1002, 276.166667],
                  [1203, 276.166667],
                  [1203, 0.166667],
                  [1002, 0.166667],
                ],
              ],
            },
          },
        ],
      };

      var labelIcon = (roomName: string | null) =>
        new L.DivIcon({
          className: "my-div-icon",
          html: `<div style="display:flex; gap:4px; align-items:start"><img alt="marker" src="/images/marker.svg" /><span>${roomName}</span></div>`,
          iconAnchor: [8, 12],
        });

      var roomIcon = L.icon({
        iconUrl: "/images/marker.svg",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        tooltipAnchor: [12, 0],
      });

      // @ts-ignore
      L.geoJSON(roomGeoJSON, {
        pointToLayer: function (feature, position) {
          return L.marker(position, {
            icon: labelIcon(feature.properties.name),
            // icon: roomIcon,
          });
          // .bindTooltip(feature.properties.name, {
          //   permanent: true,
          //   direction: "right",
          // });
        },
      }).addTo(map);

      var myLocationGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [150, 577 - 145],
            },
          },
        ],
      };

      var myLocationIcon = L.icon({
        iconUrl: "/images/my-loc.svg",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // @ts-ignore
      L.geoJSON(myLocationGeoJSON, {
        pointToLayer: function (feature, position) {
          return L.marker(position, {
            icon: myLocationIcon,
          });
        },
      }).addTo(map);

      var editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100",
              message: "<strong>Oh snap!<strong> you can't draw that!",
            },
          },
          circle: false,
          circlemarker: false,
          rectangle: {},
          marker: false,
        },
        edit: {
          featureGroup: editableLayers,
          remove: true,
          edit: false,
        },
      });
      map.addControl(drawControl);

      map.on("draw:created", function (e) {
        var type = (e as L.DrawEvents.Created).layerType,
          layer = (e as L.DrawEvents.Created).layer;

        var roomName = prompt("Enter room name:");

        if (roomName) {
          layer.bindTooltip(roomName, {
            permanent: true,
            direction: "center",
          });

          // layer.on("click", function () {
          //   roomName = prompt("Enter new room name:");
          //   layer.setTooltipContent(roomName ? roomName : "");
          // });

          editableLayers.addLayer(layer);

          var centroid = (layer as L.Polygon).getCenter();
        }
      });
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white text-black">
      <div
        id="map"
        style={{ height: "577px", width: "1204px", background: "#F5F5F5" }}
        ref={mapRef}
      ></div>
    </div>
  );
};

export default ManualMap;
