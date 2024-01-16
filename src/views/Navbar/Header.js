import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React, { useEffect, useState } from "react";

import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Button from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import Drawer from "@mui/joy/Drawer";
import Dropdown from "@mui/joy/Dropdown";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ModalClose from "@mui/joy/ModalClose";
import { ReactComponent as Cave } from "../../images/cave.svg";

import { useTranslation } from "react-i18next";
import { useActiveContent } from "../../apis/ActiveContentContext";
import { useCheckAuthentication, useLogout } from "../../apis/AuthContext";
import Notifications from "../dashboard/notifications/NotificationsHeader";
import { LanguageSelector } from "./LanguageSelector";
import Navigation from "./Navigation";
import { fetchUserInfo } from "../../apis/UserController";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);
  const { t } = useTranslation("translation");
  const checkAuthentication = useCheckAuthentication();
  const logout = useLogout();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await fetchUserInfo();
        setUserData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profileImage: userData.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user information", error);
      }
    };
    fetchProfile();
  }, []);
  const handleLogOut = async (event) => {
    const check = checkAuthentication();
    event.preventDefault();
    logout();
  };
  const { activeContent, setNewActiveContent } = useActiveContent();

  const handleItemClick = (content) => {
    setNewActiveContent(content);
  };

  useEffect(() => {
    // Check the current route and set the pressedButton state accordingly
    const currentRoute = window.location.pathname;

    if (currentRoute === "/authenticate/search-page") {
      setPressedButton("search");
    } else if (currentRoute === "/authenticate/contribute") {
      setPressedButton("contribute");
    } else if (currentRoute === "/authenticate/dashboard") {
      setPressedButton("dashboard");
    } else if (currentRoute === "/authenticate/map") {
      setPressedButton("map");
    } else if (currentRoute === "/authenticate/home") {
      setPressedButton("home");
    } else {
      setPressedButton(null);
    }
  }, []); // Run this effect only once on component mount

  // Function to handle button click
  const handleButtonClick = (buttonId) => {
    setPressedButton(buttonId);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <IconButton
          size="md"
          variant="outlined"
          href="/authenticate/home"
          color="neutral"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            borderRadius: "50%",
          }}
        >
          <Cave
            style={{ width: "20px", height: "100%", borderRadius: "50%" }}
          />
        </IconButton>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/authenticate/home"
          size="sm"
          sx={{ alignSelf: "center" }}
          aria-pressed={pressedButton === "home"}
          onClick={() => handleButtonClick("home")}
        >
          {t("Navbar.home")}
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/authenticate/dashboard"
          size="sm"
          sx={{ alignSelf: "center" }}
          aria-pressed={pressedButton == "dashboard"}
          onClick={() => handleButtonClick("dashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/authenticate/contribute"
          size="sm"
          aria-pressed={pressedButton === "contribute"}
          onClick={() => handleButtonClick("contribute")}
          sx={{ alignSelf: "center" }}
        >
          {t("Navbar.contribute")}
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/authenticate/search-page"
          size="sm"
          sx={{ alignSelf: "center" }}
          aria-pressed={pressedButton === "search"}
          onClick={() => handleButtonClick("search")}
        >
          {t("Navbar.search")}
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/authenticate/map"
          size="sm"
          sx={{ alignSelf: "center" }}
          aria-pressed={pressedButton === "map"}
          onClick={() => handleButtonClick("map")}
        >
          {t("Navbar.map")}
        </Button>
      </Stack>
      <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
        <IconButton
          variant="plain"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle>Speolo</DialogTitle>
          <Box sx={{ px: 1 }}>
            <Navigation />
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Notifications />
        <LanguageSelector color="black" />

        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              borderRadius: "9999999px",
            }}
          >
            <Avatar
              src={
                userData.profileImage ||
                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
              }
              sx={{ maxWidth: "32px", maxHeight: "32px" }}
            />
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <a href="/authenticate/dashboard" style={{ margin: 0 }}>
              <MenuItem onClick={() => handleItemClick("profil")}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={
                      userData?.profileImage ||
                      "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    }
                    sx={{ borderRadius: "50%" }}
                  />
                  <Box sx={{ ml: 1.5 }}>
                    <Typography level="title-sm" textColor="text.primary">
                      {userData.firstName} {userData.lastName}
                    </Typography>
                    <Typography level="body-xs" textColor="text.tertiary">
                      {userData.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </a>
            <ListDivider />
            <a href="/authenticate/contact" style={{ margin: 0 }}>
              <MenuItem>
                <HelpRoundedIcon />
                Contact
              </MenuItem>
            </a>
            <a href="/authenticate/dashboard" style={{ margin: 0 }}>
              <MenuItem onClick={() => handleItemClick("settings")}>
                <SettingsRoundedIcon />
                {t("Browse.settings")}
              </MenuItem>
            </a>
            <ListDivider />

            <MenuItem onClick={handleLogOut}>
              <LogoutRoundedIcon />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
