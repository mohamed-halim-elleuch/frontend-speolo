import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import ChangeSkin from "./changeSkin";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  fetchCaveDataByGeolocation,
  searchCaves,
} from "../../apis/CaveController";

const Map = () => {
  const [caves, setCaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const swLat = 43.5631;
      const swLng = 6.9086;
      const neLat = 43.7515;
      const neLng = 7.4818;

      const data = await fetchCaveDataByGeolocation(swLat, swLng, neLat, neLng);
      console.log("data", data);

      setCaves(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("cc", caves);
  }, []);

  // Coordinates for the initial marker
  const initialPosition = [43.614386, 7.0685501];

  const [currentTileLayer, setCurrentTileLayer] = useState({
    name: "Default",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  });

  // Function to handle tile layer change
  const handleChangeTileLayer = (newTileLayer) => {
    setCurrentTileLayer(newTileLayer);
  };

  const customIcon = new Icon({
    iconUrl: require("../../images/marker.png"),
    iconSize: [32, 32],
  });

  const createClusterCustomIcon = function (cluster) {
    const childCount = cluster.getChildCount();

    const iconHtml = `<svg class="hexagon" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                      <text x="20" y="25" font-size="20" text-anchor="middle" fill="#fff">${childCount}</text>
                      <polygon points="20,0 40,10 40,30 20,40 0,30 0,10" fill="rgba(76, 175, 80, 0.6)"/>
                    </svg>`;

    return divIcon({
      html: iconHtml,
      className: "custom-marker-cluster",
      iconSize: point(60, 60, true),
    });
  };

  return (
    <MapContainer center={initialPosition} zoom={5} scrollWheelZoom={false}>
      <ChangeSkin
        currentTileLayer={currentTileLayer}
        onChangeTileLayer={handleChangeTileLayer}
      />

      <TileLayer
        url={currentTileLayer.url}
        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <MarkerClusterGroup
          chunkedLoading
          //iconCreateFunction={createClusterCustomIcon}
        >
          {caves
            .filter((item) => item.latitude && item.longitude) // Filter out items without latitude or longitude
            .map((item) => (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={customIcon}
              >
                <Popup>{`${item.name}`}</Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default Map;
