// Map.js
import { Icon } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "react-leaflet-supercluster/src/styles.css";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import L from "leaflet";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { EditControl } from "react-leaflet-draw";
import MapLogic from "./MapLogic";
import ChangeSkin from "./changeSkin";
import { SetBoundsRectangles } from "./viewbounds";
import { SuperClustering } from "react-leaflet-supercluster";

const Map = () => {
  const {
    caves,
    loading,
    bounds,
    _onEdited,
    _onCreated,
    _onDeleted,
    markerClick,
    caveInfo,
    isLoading,
  } = MapLogic();
  const drawControlOptions = {
    polygon: {
      shapeOptions: {
        color: "red",
        fillOpacity: 0,
        opacity: 0.2,
      },
    },
    rectangle: {
      shapeOptions: {
        color: "black",
        fillOpacity: 0,
        opacity: 0.15,
      },
      circle: {
        shapeOptions: {
          color: "blue",
          fillOpacity: 0,
          opacity: 0.15,
        },
      },
    },
  };

  const initialPosition = [43.614386, 7.0685501];
  const [currentTileLayer, setCurrentTileLayer] = useState({
    name: "Default",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  });

  const handleChangeTileLayer = (newTileLayer) => {
    setCurrentTileLayer(newTileLayer);
  };

  const customIcon = new Icon({
    iconUrl: require("../../images/marker.png"),
    iconSize: [32, 32],
  });

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
      {bounds && <SetBoundsRectangles innerBounds={bounds} />}
      <FeatureGroup>
        <EditControl
          position="topright"
          onEdited={_onEdited}
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          draw={{
            ...drawControlOptions,
            polyline: false,
            marker: false,
            circle: true,
            polygon: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <MarkerClusterGroup>
          {caves?.map((item, index) => (
            <Marker
              key={index}
              position={[item[1], item[0]]}
              icon={customIcon}
              eventHandlers={{ click: () => markerClick(item) }}
            >
              <CustomPopup data={caveInfo} isLoading={isLoading} />
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default Map;

const CustomPopup = ({ data, isLoading }) => (
  <Popup>
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <div>
        <div
          style={{
            color: "blue",
            fontSize: "16px",
            marginBottom: "-10px",
            textAlign: "center",
          }}
        >
          {data?.caveName}
        </div>
        <br />
        <strong>Cave ID:</strong> {data?.caveId || "No_data"}
        <br />
        <strong>City:</strong> {data?.city || "No_data"}
        <br />
        <strong>Region:</strong> {data?.region || "No_data"}
        <br />
        <strong>Depth:</strong> {data?.depth || "No_data"}
        <br />
        <strong>Length:</strong> {data?.length || "No_data"}
        <br />
        <strong>Coordinates:</strong> {data?.latitude?.toFixed(4)}{" "}
        <strong>,</strong> {data?.longitude?.toFixed(4)}
        <br />
        <strong>Quality:</strong> {data?.quality || "No_data"}
        <br />
        <strong>Observations:</strong>{" "}
        <a href={`caves/${data?.caveId}`} target="_blank" rel="noopener">
          Open in new tab
        </a>
        <br />
      </div>
    )}
  </Popup>
);
