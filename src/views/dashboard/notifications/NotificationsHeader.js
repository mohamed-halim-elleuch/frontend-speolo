import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import {
  Badge,
  Dropdown,
  ListItemContent,
  MenuButton,
  Typography,
} from "@mui/joy";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

const menuItems = [
  {
    title: "Details of deleted contribution",
    content: "File observation_refneet.csv is deleted by…",
    unread: true ? "primary" : "neutral",
  },
  {
    title: "Details of deleted sensor",
    content: "Sensor soft is deleted, sensor id=...",
    unread: true ? "primary" : "neutral",
  },
  {
    title: "Delete notification",
    content: "User Anonymous 123 is deleted, user id=...",
    unread: false ? "primary" : "neutral",
  },
  {
    title: "Delete notification",
    content: "User Anonymous 123 is deleted, user id=...",
    unread: true ? "primary" : "neutral",
  },
  {
    title: "Create notification",
    content: "File observation_refneet.csv is added by…",
    unread: true ? "primary" : "neutral",
  },
];

const renderMenuItem = (title, content, unread) => (
  <MenuItem onClick={() => {}} component="a" href="#actionable">
    <ListItemContent sx={{ paddingBlock: 0.2 }}>
      <Typography level="title-sm" color={unread}>
        {title}
      </Typography>
      <div
        style={{
          fontSize: "14px",
          color: "#555E70",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {content}
      </div>
    </ListItemContent>
  </MenuItem>
);

function NotificationsHeader() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = React.useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <Tooltip title="Notifications">
        <MenuButton
          variant="plain"
          size="sm"
          sx={{
            borderRadius: 40,
            p: 1,
            gap: 1,
            "--ListItem-radius": "var(--joy-radius-sm)",
          }}
        >
          <Badge badgeContent={4} variant="soft" size="sm">
            <NotificationsRoundedIcon />
          </Badge>
        </MenuButton>
      </Tooltip>
      <Menu placement="bottom-end" sx={{ zIndex: "99999", width: "250px" }}>
        {menuItems.map((menuItem, index) =>
          renderMenuItem(menuItem.title, menuItem.content, menuItem.unread)
        )}
      </Menu>
    </Dropdown>
  );
}

export default NotificationsHeader;
