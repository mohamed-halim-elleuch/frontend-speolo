import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import dateFormat from "dateformat";

const ListItemComponent = ({ fileName, user, caveId, createdAt }) => (
  <ListItem>
    <ListItemButton variant="soft" sx={{ bgcolor: "transparent" }}>
      <ListItemContent sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            level="title-sm"
            startDecorator={<TextSnippetIcon color="primary" />}
            sx={{ alignItems: "flex-start" }}
          >
            {fileName}
          </Typography>
          <div style={{ fontSize: "14px", color: "#555E70" }}>{user}</div>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <div style={{ fontSize: "14px", color: "#555E70" }}>{caveId}</div>
          <div style={{ fontSize: "14px", color: "#555E70" }}>
            {dateFormat(createdAt, "ddd, mmm dS, yyyy")} at{" "}
            {dateFormat(createdAt, "h:MM:ss TT")}
          </div>
        </Box>
      </ListItemContent>
    </ListItemButton>
  </ListItem>
);

function SmallTable({ items }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        display: { xs: "inherit", sm: "none" },
        borderRadius: "sm",
        overflow: "auto",
        backgroundColor: "background.surface",
        "& > *": {
          "&:nth-child(n):not(:nth-last-child(-n+4))": {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <List size="sm" aria-labelledby="table-in-list">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ListItemComponent {...item} />
            {index < items.length - 1 && <ListDivider />}
          </React.Fragment>
        ))}
      </List>
    </Sheet>
  );
}

export default SmallTable;
