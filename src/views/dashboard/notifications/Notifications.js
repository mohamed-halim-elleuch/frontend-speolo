import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import * as React from "react";

const data = [
  {
    name: "Alex Jonnold",
    avatar: "https://i.pravatar.cc/40?img=3",
    avatar2x: "https://i.pravatar.cc/80?img=3",
    date: "21 Oct 2022",
    title: "Deleted contribution",
    body: "File observation_refneet.csv is deleted by…",
    color: "warning.400",
    unread: true,
  },
  {
    name: "Pete Sand",
    avatar: "https://i.pravatar.cc/40?img=4",
    avatar2x: "https://i.pravatar.cc/80?img=4",
    date: "06 Jul 2022",
    title: "Deleted sensor",
    body: "Sensor soft is deleted, sensor id=...",
    color: "success.400",
    unread: true,
  },
  {
    name: "Kate Gates",
    avatar: "https://i.pravatar.cc/40?img=5",
    avatar2x: "https://i.pravatar.cc/80?img=5",
    date: "16 May 2022",
    title: "Delete notification",
    body: "Sensor soft is deleted, sensor id=...",
    color: "primary.500",
    unread: false,
  },
  {
    name: "John Snow",
    avatar: "https://i.pravatar.cc/40?img=7",
    avatar2x: "https://i.pravatar.cc/80?img=7",
    date: "10 May 2022",
    title: "Create notification",
    body: "File observation_refneet.csv is added by…",
    color: "danger.500",
    unread: true,
  },
  {
    name: "Michael Scott",
    avatar: "https://i.pravatar.cc/40?img=8",
    avatar2x: "https://i.pravatar.cc/80?img=8",
    date: "13 Apr 2022",
    title: "Delete notification",
    body: "User Anonymous 123 is deleted, user id=...",
    color: "danger.500",
    unread: true,
  },
  {
    name: "Alex Jonnold",
    avatar: "https://i.pravatar.cc/40?img=3",
    avatar2x: "https://i.pravatar.cc/80?img=3",
    date: "21 Oct 2022",
    title: "Deleted contribution",
    body: "File observation_refneet.csv is deleted by…",
    color: "warning.400",
    unread: true,
  },
  {
    name: "Pete Sand",
    avatar: "https://i.pravatar.cc/40?img=4",
    avatar2x: "https://i.pravatar.cc/80?img=4",
    date: "06 Jul 2022",
    title: "Deleted sensor",
    body: "Sensor soft is deleted, sensor id=...",
    color: "success.400",
    unread: true,
  },
  {
    name: "Kate Gates",
    avatar: "https://i.pravatar.cc/40?img=5",
    avatar2x: "https://i.pravatar.cc/80?img=5",
    date: "16 May 2022",
    title: "Delete notification",
    body: "Sensor soft is deleted, sensor id=...",
    color: "primary.500",
    unread: false,
  },
  {
    name: "John Snow",
    avatar: "https://i.pravatar.cc/40?img=7",
    avatar2x: "https://i.pravatar.cc/80?img=7",
    date: "10 May 2022",
    title: "Create notification",
    body: "File observation_refneet.csv is added by…",
    color: "danger.500",
    unread: true,
  },
  {
    name: "Michael Scott",
    avatar: "https://i.pravatar.cc/40?img=8",
    avatar2x: "https://i.pravatar.cc/80?img=8",
    date: "13 Apr 2022",
    title: "Delete notification",
    body: "User Anonymous 123 is deleted, user id=...",
    color: "danger.500",
    unread: true,
  },
  {
    name: "Alex Jonnold",
    avatar: "https://i.pravatar.cc/40?img=3",
    avatar2x: "https://i.pravatar.cc/80?img=3",
    date: "21 Oct 2022",
    title: "Deleted contribution",
    body: "File observation_refneet.csv is deleted by…",
    color: "warning.400",
    unread: true,
  },
  {
    name: "Pete Sand",
    avatar: "https://i.pravatar.cc/40?img=4",
    avatar2x: "https://i.pravatar.cc/80?img=4",
    date: "06 Jul 2022",
    title: "Deleted sensor",
    body: "Sensor soft is deleted, sensor id=...",
    color: "success.400",
    unread: true,
  },
  {
    name: "Kate Gates",
    avatar: "https://i.pravatar.cc/40?img=5",
    avatar2x: "https://i.pravatar.cc/80?img=5",
    date: "16 May 2022",
    title: "Delete notification",
    body: "Sensor soft is deleted, sensor id=...",
    color: "primary.500",
    unread: false,
  },
  {
    name: "John Snow",
    avatar: "https://i.pravatar.cc/40?img=7",
    avatar2x: "https://i.pravatar.cc/80?img=7",
    date: "10 May 2022",
    title: "Create notification",
    body: "File observation_refneet.csv is added by…",
    color: "danger.500",
    unread: true,
  },
  {
    name: "Michael Scott",
    avatar: "https://i.pravatar.cc/40?img=8",
    avatar2x: "https://i.pravatar.cc/80?img=8",
    date: "13 Apr 2022",
    title: "Delete notification",
    body: "User Anonymous 123 is deleted, user id=...",
    color: "danger.500",
    unread: true,
  },
];

const getInitials = (name) => {
  const names = name.split(" ");
  return names.map((word) => word[0]).join("");
};

export default function Notification() {
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
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemButton
              {...(index === 0 && {
                selected: true,
                color: "neutral",
              })}
              sx={{
                p: 0.7,
                paddingInline: 1.2,
                borderLeft: item.unread && "3px solid #0b6bcb",
              }}
            >
              <ListItemDecorator
                sx={{
                  alignSelf: "flex-start", // Add a border to the Left side
                }}
              >
                <Avatar alt="" sx={{ backgroundColor: "#a9a9ff70" }}>
                  {getInitials(item.name)}
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
                    <Typography level="body-xs">{item.name}</Typography>
                    {item.unread && (
                      <Box
                        sx={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "99px",
                          bgcolor: item.color,
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
                      color: item.unread ? "blueviolet" : "darkslategrey",
                    }}
                  >
                    {item.title}
                  </div>
                  <Typography
                    level="body-xs"
                    textColor="text.tertiary"
                    sx={{ width: "18%" }}
                  >
                    {item.date}
                  </Typography>
                </Box>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#555E68",
                    }}
                  >
                    {item.body}
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
