import LayersIcon from "@mui/icons-material/Layers";
import { Dropdown, MenuButton } from "@mui/joy";
import Menu from "@mui/joy/Menu";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
const ChangeSkin = ({ currentTileLayer, onChangeTileLayer }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = React.useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  const tileLayers = [
    {
      name: "Default",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "France openstreetmap",
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    },
  ];
  const handleChangeTileLayer = (newTileLayer) => {
    onChangeTileLayer(newTileLayer);
    setOpen(false);
  };

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <Tooltip title="Layer">
        <MenuButton
          variant="plain"
          size="sm"
          color="danger"
          sx={{
            borderRadius: 40,
            position: "absolute",
            top: "12vh",
            left: "10px",
            zIndex: 1000,

            padding: "5px",
            cursor: "pointer",
          }}
        >
          <LayersIcon />
        </MenuButton>
      </Tooltip>
      <Menu placement="bottom-end" sx={{ p: 0, zIndex: "99999" }}>
        <Sheet
          variant="outlined"
          sx={{
            boxShadow: "sm",
            borderRadius: "sm",
            p: 1,
          }}
        >
          <RadioGroup
            defaultValue={currentTileLayer.url}
            name="radio-buttons-group"
            sx={{ gap: 1, "& > div": { p: 1 } }}
            size="sm"
          >
            {tileLayers.map((layer) => (
              <Radio
                size="sm"
                key={layer.name}
                value={layer.url}
                label={layer.name}
                variant="soft"
                onChange={() => handleChangeTileLayer(layer)}
              />
            ))}
          </RadioGroup>
        </Sheet>
      </Menu>
    </Dropdown>
  );
};

export default ChangeSkin;
