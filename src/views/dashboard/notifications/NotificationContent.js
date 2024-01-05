import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Sheet from "@mui/joy/Sheet";
import Snackbar from "@mui/joy/Snackbar";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import dateFormat from "dateformat";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  deleteNotification,
  getNotificationById,
} from "../../../apis/NotificationController";

export default function NotificationContent({ selectedNotificationId }) {
  const [open, setOpen] = React.useState([false, false, false]);
  const [notification, setNotification] = React.useState([]);
  React.useEffect(() => {
    const fetchNotification = async () => {
      try {
        const responseNotifications = await getNotificationById(
          selectedNotificationId || "6592b2494ea010743ec4ad1d"
        );
        const responseString = responseNotifications.data.description;
        const match = responseString.match(/id: (\w+)/);
        const deltedObjectId = match && match[1];
        console.log("deltedObjectId", deltedObjectId);
        // if (deltedObjectId) {
        //   // Sending another request using the extracted ID
        //   const secondResponse = await getSensorTypeById(deltedObjectId);
        //   setNotification({
        //     ...responseNotifications.data,
        //     secondData: secondResponse.data,
        //   });
        //   // Handle the second response data
        //   console.log("Second response:", secondResponse.data);
        // } else {
        setNotification(responseNotifications.data);
        console.error("ID not found in the response");
        // }

        console.log(notification);
      } catch (error) {
        console.error("Error fetching Notification:", error);
      }
    };

    fetchNotification();
  }, [selectedNotificationId]);

  const handleSnackbarOpen = async (index) => {
    try {
      //await deleteNotification(selectedNotificationId);
      const updatedOpen = [...open];
      updatedOpen[index] = true;
      setOpen(updatedOpen);
    } catch (error) {
      console.error("Error deleting Notification:", error);
    }
  };

  const handleSnackbarClose = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        minHeight: 300,
        borderRadius: "sm",
        p: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" />
          <Box sx={{ ml: 2 }}>
            <Typography level="title-sm" textColor="text.primary" mb={0.5}>
              Alex Jonnold
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              {dateFormat(notification?.createdAt, "ddd, mmm dS, yyyy")} at{" "}
              {dateFormat(notification?.createdAt, "h:MM:ss TT")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "32px",
            flexDirection: "row",
            gap: 1.5,
          }}
        >
          <Button
            size="sm"
            variant="plain"
            color="danger"
            startDecorator={<DeleteRoundedIcon />}
            onClick={() => handleSnackbarOpen(2)}
          >
            Delete
          </Button>
          <Snackbar
            color="danger"
            open={open[2]}
            onClose={() => handleSnackbarClose(2)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(2)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your notification has been deleted.
          </Snackbar>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{
          py: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Typography level="title-lg" textColor="text.primary">
          {notification?.title}
        </Typography>
      </Box>
      <Divider />
      <div
        style={{
          fontSize: "14px",
          color: "#555E70",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        {notification?.description}
        <br />
        {/* File observation_refneet.csv is deleted by Anonymous 123.
        <br />
        <br />
        This file is related to cave "Embut de villebruc" located in Valbonne.
        <br />
        He has information from 10-10-2021 to 12-12-2022 from Reefnet sensor */}
      </div>
      {/* <Divider /> */}
      {/* <Typography level="title-sm" mt={2} mb={2}>
        Attachments
      </Typography>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          "& > div": {
            boxShadow: "none",
            "--Card-padding": "0px",
            "--Card-radius": theme.vars.radius.sm,
          },
        })}
      >
        <Card variant="outlined" orientation="horizontal">
          <CardOverflow>
            <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
              <div>
                <ArticleIcon />
              </div>
            </AspectRatio>
          </CardOverflow>
          <Box sx={{ py: { xs: 1, sm: 2 }, pr: 2 }}>
            <Typography level="title-sm" color="primary">
              observation.csv
            </Typography>
            <Typography level="body-xs">100 KB</Typography>
          </Box>
        </Card>
      </Box> */}
    </Sheet>
  );
}
