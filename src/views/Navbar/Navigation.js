import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SensorsIcon from "@mui/icons-material/Sensors";
import SettingsIcon from "@mui/icons-material/Settings";
import { Chip } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListSubheader from "@mui/joy/ListSubheader";
import * as React from "react";
import { useActiveContent } from "../../apis/ActiveContentContext";
export default function Navigation() {
  const { activeContent, setNewActiveContent } = useActiveContent();

  const handleItemClick = (content) => {
    setNewActiveContent(content);
  };

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem nested>
        <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
          Browse
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          <ListItem>
            <ListItemButton
              selected={activeContent === "profil"}
              onClick={() => handleItemClick("profil")}
            >
              <ListItemDecorator>
                <AccountCircleIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Profil</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={activeContent === "settings"}
              onClick={() => handleItemClick("settings")}
            >
              <ListItemDecorator>
                <SettingsIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Settings</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={activeContent === "accounts"}
              onClick={() => handleItemClick("accounts")}
            >
              <ListItemDecorator>
                <PeopleAltIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Managing accounts</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={activeContent === "observations"}
              onClick={() => handleItemClick("observations")}
            >
              <ListItemDecorator>
                <FindInPageIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Observations</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={activeContent === "sensors"}
              onClick={() => handleItemClick("sensors")}
            >
              <ListItemDecorator>
                <SensorsIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Sensor Types</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={activeContent === "notifications"}
              onClick={() => handleItemClick("notifications")}
            >
              <ListItemDecorator>
                <NotificationsActiveIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Notifications</ListItemContent>
              <Chip variant="soft" color="warning" size="sm">
                4
              </Chip>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
