import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import React, { useState, useEffect } from "react";

import Layout from "../../Navbar/Layout.tsx";
import NotificationContent from "./NotificationContent.js";
import Notifications from "./Notifications.js";
import { getNotifications } from "../../../apis/NotificationController.js";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification);
  };
  // useEffect(() => {
  //   const fetchNotification = async () => {
  //     try {
  //       const responseNotifications = await getNotifications();
  //       setNotifications(responseNotifications.data);
  //       handleNotificationSelect(responseNotifications.data[0]);
  //       console.log(notifications);
  //     } catch (error) {
  //       console.error("Error fetching Notifications :", error);
  //     }
  //   };

  //   fetchNotification();
  // }, []);
  const fetchData = async () => {
    try {
      const response = await getNotifications("", page * 15, 15);
      const newData = response.data;
      if (page === 0) {
        handleNotificationSelect(newData[0]);
        setNotifications(newData);
      } else {
        setNotifications((prevData) => [...prevData, ...newData]);
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const filterData = (notifications) => {
      console.log(notifications);
      return notifications.filter((notification) => {
        const matchesNotificationType = notification?.itemType
          ?.toLowerCase()
          .includes(searchInput.toLowerCase());

        const matchesSearchInput = notification?.notificationType
          ?.toLowerCase()
          .includes(searchInput.toLowerCase());

        return matchesNotificationType || matchesSearchInput;
      });
    };
    console.log(searchInput);
    if (searchInput === "") {
      setPage(0);
      fetchData();
    } else {
      const filterdata = filterData(notifications);
      setNotifications(filterdata);
    }
  }, [searchInput]);
  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    // You can optionally fetch data here if you want to update results immediately
  };

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
            value={searchInput}
            onChange={handleSearchChange}
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
        <NotificationContent selectedNotification={selectedNotification} />
      </Layout.Main>
    </Box>
  );
}
