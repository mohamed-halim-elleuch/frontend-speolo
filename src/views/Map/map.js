// Map.js
import OpenInNew from "@mui/icons-material/OpenInNew";
import { IconButton } from "@mui/joy";
import { Autocomplete, TextField } from "@mui/material";
import { Icon } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { EditControl } from "react-leaflet-draw";
import { OpenStreetMapProvider } from "react-leaflet-geosearch";
import "react-leaflet-supercluster/src/styles.css";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../apis/UserController";
import MapLogic from "./MapLogic";
import ChangeSkin from "./changeSkin";
import "./style.css";
import { SetBoundsRectangles } from "./viewbounds";
import { useTranslation } from "react-i18next";
const Map = () => {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserInfo();
        setAddress(userData.preferedLocation);
      } catch (error) {
        console.error("Error fetching sensor types:", error);
        // Handle errors as needed
      }
    };
    fetchData();
    // Mark the page as refreshed
  }, []);
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
    CollectCavesID,
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

  const [position, setPosition] = useState(null); // Initialize with null until the geocoding is done

  const mapRef = React.useRef(null);
  React.useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: address });

        if (results && results.length > 0) {
          const { y, x } = results[0];
          setPosition([y, x]);
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    };

    geocodeAddress();
  }, [address]);

  useEffect(() => {
    if (position && mapRef.current) {
      mapRef.current.whenReady(() => {
        mapRef.current.setView(position);
      });
    }
  }, [position]);
  const handleRectangleClick = async () => {
    // Redirect to another page with all caves inside the rectangle
    const ids = await CollectCavesID();
    navigate(`/authenticate/search-page/${ids}`);
  };
  return (
    position && (
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={9}
        scrollWheelZoom={false}
      >
        <ChangeSkin
          currentTileLayer={currentTileLayer}
          onChangeTileLayer={handleChangeTileLayer}
        />

        <TileLayer
          url={currentTileLayer.url}
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
        />

        {bounds && <SetBoundsRectangles innerBounds={bounds} />}
        <OpenStreetMapSearch setAddress={setAddress} mapRef={mapRef} />
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

        {bounds && (
          <IconButton
            aria-label="Open in new tab"
            onClick={handleRectangleClick}
            color="primary"
            sx={{
              borderRadius: 40,
              position: "absolute",
              top: "17vh",
              left: "10px",
              zIndex: 1000,

              padding: "5px",
              cursor: "pointer",
            }}
          >
            <OpenInNew />
          </IconButton>
        )}

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
    )
  );
};

export default Map;

const OpenStreetMapSearch = ({ setAddress, mapRef }) => {
  const { t } = useTranslation("translation");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

  const handleAutocomplete = async (query) => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query });
    // Extract suggestions from the results
    const suggestions = results.map((result) => result.label);

    // Set the autocomplete suggestions state
    setAutocompleteSuggestions(suggestions);
  };

  const handleSelectSuggestion = async (suggestion) => {
    // Set the selected suggestion as the address
    if (!suggestion) {
      // Example: Set the map view to a default location (e.g., center of the world)
      return;
    }
    setAddress(suggestion);

    // Clear the autocomplete suggestions
    setAutocompleteSuggestions([]);
  };

  return (
    <div className="leaflet-control-search">
      <Autocomplete
        fullWidth
        size="small"
        freeSolo
        id="searchInput"
        options={autocompleteSuggestions}
        onChange={(event, value) => handleSelectSuggestion(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("Map.search")}
            onInput={(e) => handleAutocomplete(e.target.value)}
          />
        )}
      />
    </div>
  );
};

const CustomPopup = ({ data, isLoading }) => {
  const { t } = useTranslation("translation");
  return (
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
          <strong>{t("Map.cave_id")}:</strong> {data?.caveId || "No_data"}
          <br />
          <strong>{t("Map.city")}:</strong> {data?.city || "No_data"}
          <br />
          <strong>{t("Map.region")}:</strong> {data?.region || "No_data"}
          <br />
          <strong>{t("Map.depth")}:</strong> {data?.depth || "No_data"}
          <br />
          <strong>{t("Map.length")}:</strong> {data?.length || "No_data"}
          <br />
          <strong>{t("Map.coordinates")}:</strong> {data?.latitude?.toFixed(4)}{" "}
          <strong>,</strong> {data?.longitude?.toFixed(4)}
          <br />
          <strong>{t("Map.quality")}:</strong> {data?.quality || "No_data"}
          <br />
          <strong>{t("Map.observations")}:</strong>{" "}
          <a href={`caves/${data?.caveId}`} target="_blank" rel="noopener">
            {t("Map.new_tab")}
          </a>
          <br />
        </div>
      )}
    </Popup>
  );
};
