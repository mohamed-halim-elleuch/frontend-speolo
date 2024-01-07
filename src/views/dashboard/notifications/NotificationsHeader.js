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
import { getNotifications } from "../../../apis/NotificationController";

const renderMenuItem = (title, content, unread) => (
  <MenuItem onClick={() => {}} component="a" href="#actionable">
    <ListItemContent sx={{ paddingBlock: 0.2 }}>
      <Typography level="title-sm" style={{ color: unread ? "blue" : "black" }}>
        {title}
      </Typography>
      <div
        style={{
          fontSize: "13px",
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
  const [notifications, setNotifications] = React.useState([]);
  const [unread, setUnread] = React.useState(null);
  React.useEffect(() => {
    const fetchNotification = async () => {
      try {
        const responseNotifications = await getNotifications("", 0, 20);
        setNotifications(responseNotifications.data);
        setUnread(responseNotifications?.unreadCount);
        console.log(notifications);
      } catch (error) {
        console.error("Error fetching Notifications :", error);
      }
    };

    fetchNotification();
  }, []);

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
          <Badge badgeContent={unread} variant="soft" size="sm">
            <NotificationsRoundedIcon />
          </Badge>
        </MenuButton>
      </Tooltip>
      <Menu
        placement="bottom-end"
        sx={{
          zIndex: "99999",
          width: "250px",
          height: "30vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "12px", // Set the width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", // Set the color of the thumb
            borderRadius: "8px",
            backgroundClip: "content-box",
            border: "3px solid transparent",
          },

          "&::-webkit-scrollbar-thumb:hover": {
            background: "#7A90A4",
            backgroundClip: "content-box",
            border: "3px solid transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Set the color of the track
            borderRadius: "10px",
            // Round the corners of the track
          },
        }}
      >
        {notifications?.map((menuItem, index) =>
          renderMenuItem(
            menuItem?.title,
            `${menuItem?.notificationType}: ${menuItem?.itemType}`,
            !menuItem?.isRead
          )
        )}
      </Menu>
    </Dropdown>
  );
}

export default NotificationsHeader;
