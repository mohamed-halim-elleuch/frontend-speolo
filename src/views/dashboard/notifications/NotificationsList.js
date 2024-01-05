import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import * as React from "react";
import Layout from "../../Navbar/Layout.tsx";
import NotificationContent from "./NotificationContent.js";
import Notifications from "./Notifications.js";
import { getNotifications } from "../../../apis/NotificationController.js";

export default function NotificationsList() {
  const [notifications, setNotifications] = React.useState([]);
  const [selectedNotificationId, setSelectedNotificationId] =
    React.useState(null);

  const handleNotificationSelect = (id) => {
    setSelectedNotificationId(id);
  };
  React.useEffect(() => {
    const fetchNotification = async () => {
      try {
        const responseNotifications = await getNotifications();
        setNotifications(responseNotifications.data);
        console.log(notifications);
      } catch (error) {
        console.error("Error fetching Notifications :", error);
      }
    };

    fetchNotification();
  }, [selectedNotificationId]);

  return (
    <Box
      sx={[
        {
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(450px, 1fr)",
            md: " minmax(300px, 510px) minmax(500px, 1fr)",
          },

          minHeight: "92vh",
        },
      ]}
    >
      <Layout.SidePane>
        <Box sx={{ p: 0.7, paddingInlineEnd: 1.5 }}>
          <Input
            size="sm"
            variant="outlined"
            placeholder="Search notification"
            startDecorator={<SearchRoundedIcon color="primary" />}
            sx={{
              alignSelf: "center",
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
          />
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              alignSelf: "center",
            }}
          >
            <SearchRoundedIcon />
          </IconButton>
        </Box>
        <Notifications
          notifications={notifications}
          onNotificationSelect={handleNotificationSelect}
        />
      </Layout.SidePane>
      <Layout.Main>
        <NotificationContent selectedNotificationId={selectedNotificationId} />
      </Layout.Main>
    </Box>
  );
}
