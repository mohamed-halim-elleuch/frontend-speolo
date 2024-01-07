import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import dateFormat from "dateformat";
import { markAsReadNotification } from "../../../apis/NotificationController";

const getInitials = (name) => {
  const names = name.split(" ");
  return names.map((word) => word[0].toUpperCase()).join("");
};

export default function Notification({ notifications, onNotificationSelect }) {
  const [selectedNotificationIndex, setSelectedNotificationIndex] =
    React.useState(0);
  const [resMessage, setResMessage] = React.useState("");

  const generateMessages = (notifications) => {
    return notifications.map((notification) => {
      const {
        notificationType,
        itemType,
        caveObservation,
        sensorType,
        deletedBy,
      } = notification;
      const { caveId } = caveObservation || {};
      const { type } = sensorType || {};
      const firstName = deletedBy?.firstName || "Unknown";
      const lastName = deletedBy?.lastName || "";

      let message;

      if (notificationType === "SoftDelete") {
        if (itemType === "Observation" && caveId) {
          message = `Soft delete of an Observation in the cave ${caveId}`;
        } else if (itemType === "SensorType" && type) {
          message = `Soft delete of a SensorType (${type})`;
        } else {
          message = `Soft delete of an ${itemType}`;
        }
      } else {
        // Handle other notification types or customize the message for non-SoftDelete types
        message = `Soft delete notification for ${itemType}`;
      }

      return `${message} by ${firstName} ${lastName}`;
    });
  };

  const notificationMessages = generateMessages(notifications);

  const handleNotificationClick = async (index) => {
    setSelectedNotificationIndex(index);
    onNotificationSelect(notifications[index]);
    try {
      const resNotifications = await markAsReadNotification(
        notifications[index]._id
      );
      setResMessage(resNotifications.message);
    } catch (error) {
      console.error("Error updating Notifications :", error);
    }
  };
  return (
    <List
      sx={{
        padding: "0px",
        maxHeight: "85vh",
        overflow: "auto",
        [`& .${listItemButtonClasses.root}.${listItemButtonClasses.selected}`]:
          {
            borderLeft: "3px solid",
            borderLeftColor: "var(--joy-palette-primary-outlinedBorder)",
          },
        "&::-webkit-scrollbar": {
          width: "12px", // Set the width of the scrollbar
          transition: "all 300ms",
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
      {notifications?.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemButton
              onClick={() => handleNotificationClick(index)}
              {...(index === selectedNotificationIndex && {
                selected: true,
                color: "neutral",
              })}
              sx={{
                p: 0.7,
                paddingInline: 1.2,
                borderLeft: !item?.isRead && "3px solid #0b6bcb",
              }}
            >
              <ListItemDecorator
                sx={{
                  alignSelf: "flex-start", // Add a border to the Left side
                }}
              >
                <Avatar alt="" sx={{ backgroundColor: "#a9a9ff70" }}>
                  {getInitials(
                    `${item?.deletedBy?.firstName || "undefined"} ${
                      item?.deletedBy?.lastName
                    }`
                  )}
                </Avatar>
              </ListItemDecorator>
              <Box sx={{ pl: 2, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 0.5,
                      width: "32%",
                    }}
                  >
                    <Typography level="body-xs">
                      {item?.deletedBy?.firstName || "undefined"}{" "}
                      {item?.deletedBy?.lastName}
                    </Typography>
                    {!item?.isRead && (
                      <Box
                        sx={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "99px",
                          bgcolor: item?.color || "warning.400",
                        }}
                      />
                    )}
                  </Box>
                  <div
                    level="title-sm"
                    style={{
                      fontSize: "14px",
                      fontWeight: 430,
                      mb: 0.5,
                      width: "50%",
                      color: !item?.isRead ? "blueviolet" : "darkslategrey",
                    }}
                  >
                    {item?.title}
                  </div>
                  <Typography
                    level="body-xs"
                    textColor="text.tertiary"
                    sx={{ width: "18%" }}
                  >
                    {dateFormat(item?.createdAt, "dd mmm yyyy")}
                  </Typography>
                </Box>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#555E68",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "26vw",
                    }}
                  >
                    {notificationMessages[index]}
                  </div>
                </div>
              </Box>
            </ListItemButton>
          </ListItem>
          <ListDivider sx={{ m: 0 }} />
        </React.Fragment>
      ))}
    </List>
  );
}
