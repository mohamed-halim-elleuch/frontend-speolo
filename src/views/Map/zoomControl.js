import React from "react";
import { useMap } from "react-leaflet";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/joy";

const CustomZoomControl = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };
  const buttonStyles = {
    root: {
      margin: 0,
    },
  };

  return (
    <div style={{ position: "absolute" }}>
      <IconButton onClick={handleZoomIn} color="primary">
        <AddIcon />
      </IconButton>
      <IconButton onClick={handleZoomOut} color="primary">
        <RemoveIcon />
      </IconButton>
    </div>
  );
};

export default CustomZoomControl;
