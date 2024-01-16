import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";

const startBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
];

const redColor = { color: "red" };
const whiteColor = { color: "white" };

export function SetBoundsRectangles({ innerBounds }) {
  const [bounds, setBounds] = useState(startBounds);
  const map = useMap();
  useEffect(() => {
    // Log innerBounds whenever it changes
    console.log("innerBounds changed:", bounds);
    const { swLat, swLng, neLat, neLng } = innerBounds;
    const mapBounds = [
      [Math.min(swLat, neLat), Math.min(swLng, neLng)],
      [Math.max(swLat, neLat), Math.max(swLng, neLng)],
    ];

    setBounds(mapBounds);

    // Define the FitBoundsOptions, adjust as needed
    const fitBoundsOptions = {
      padding: [-150, -150], // Example padding
    };

    // Fit the map bounds exactly to the rectangle with options
    map.fitBounds(mapBounds, fitBoundsOptions);
  }, [innerBounds]);

  const innerHandlers = useMemo(
    () => ({
      click() {
        const { swLat, swLng, neLat, neLng } = innerBounds;
        setBounds([
          [swLat, swLng],
          [neLat, neLng],
        ]);
        map.fitBounds([
          [swLat, swLng],
          [neLat, neLng],
        ]);
      },
    }),
    [map]
  );

  return (
    <>
      <Rectangle
        bounds={bounds}
        eventHandlers={innerHandlers}
        pathOptions={{
          ...whiteColor,
          fillOpacity: 0,
          opacity: 0.15,
        }}
      />
    </>
  );
}
