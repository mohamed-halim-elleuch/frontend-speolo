// MapLogic.js
import React, { useEffect, useState } from "react";
import {
  fetchCaveDataByGeolocation,
  fetchCavesByGeolocation,
} from "../../apis/CaveController";

const MapLogic = () => {
  const [caves, setCaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null);
  const [caveInfo, setCaveInfo] = useState(null);
  const markerClick = async (item) => {
    try {
      const data = await fetchCaveDataByGeolocation(
        item[1] - 0.0000000000001,
        item[0] - 0.0000000000001,
        item[1] + 0.0000000000001,
        item[0] + 0.0000000000001
      );

      setCaveInfo(data[0]);
      console.log(data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchCavesByGeolocation(
        bounds.swLat,
        bounds.swLng,
        bounds.neLat,
        bounds.neLng
      );

      setCaves(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBounds = (layer) => {
    const updatedBounds = {
      swLat: layer._bounds._southWest.lat,
      swLng: layer._bounds._southWest.lng,
      neLat: layer._bounds._northEast.lat,
      neLng: layer._bounds._northEast.lng,
    };

    console.log("Updated Bounds", updatedBounds);
    setBounds(updatedBounds);
  };

  const _onEdited = (e) => {
    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);
  };

  const _onCreated = (e) => {
    updateBounds(e.layer);
    let type = e.layerType;
    let layer = e.layer;
    console.log("_onCreated: something else created:", type, e);
  };

  const _onDeleted = (e) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    if (numDeleted > 0) setBounds(null);
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
  };

  useEffect(() => {
    if (bounds) {
      fetchData();
    }
  }, [bounds]);

  return {
    caves,
    loading,
    bounds,
    _onEdited,
    _onCreated,
    _onDeleted,
    markerClick,
    caveInfo,
  };
};

export default MapLogic;
