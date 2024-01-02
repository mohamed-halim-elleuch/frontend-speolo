import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import dateFormat from "dateformat";
import React, { useEffect, useState } from "react";
import { fetchUserInfo, updateUser } from "../../../apis/UserController";
import ShowMessage from "../../common/ShowMessage";

export default function ProfileUpdate() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const email = localStorage.getItem("email");
  const [updateMessage, setUpdateMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: email,
    address: "",
    license: "",
    createdAt: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await fetchUserInfo();

        if (userData) {
          setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            //email: userData.email,
            address: userData.address,
            license: userData.license,
            createdAt: userData.createdAt,
          });
        } else {
          console.error("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Error fetching user information", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
  const handleSaveButtonClick = async () => {
    try {
      const updatedUser = await updateUser(formData);

      console.log("User updated successfully:", updatedUser);
      setUpdateMessage({
        open: true,
        message: "User updated successfully!",
        status: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setUpdateMessage({
        open: true,
        message: "Error updating user. Please try again.",
        status: "error",
      });
    }
  };
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 3000); // Reset the message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "57vw",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box>
            <Typography level="title-md">Personal info</Typography>
            <div style={{ fontSize: "14px", color: "#555E70" }}>
              This account was created on{" "}
              <strong>
                {dateFormat(formData.createdAt, "dddd, mmmm dS, yyyy")}
              </strong>{" "}
              at <strong>{dateFormat(formData.createdAt, "h:MM:ss TT")}</strong>
            </div>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 140, borderRadius: "100%" }}
              >
                <img
                  src={
                    selectedImage ||
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  }
                  loading="lazy"
                  alt=""
                />
              </AspectRatio>
              <label htmlFor="upload-image">
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 120,
                    top: 190,
                    boxShadow: "sm",
                  }}
                >
                  <input
                    type="file"
                    id="upload-image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <EditRoundedIcon />
                </IconButton>
              </label>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Name</FormLabel>
                <Box
                  sx={{
                    display: { sm: "flex-column", md: "inline-flex" },
                    gap: 2,
                  }}
                >
                  <FormControl sx={{ width: "50%" }}>
                    <Input
                      size="sm"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ width: "50%" }}>
                    <Input
                      size="sm"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input size="sm" value={formData.role} readOnly />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    readOnly
                    size="sm"
                    type="email"
                    startDecorator={<EmailRoundedIcon />}
                    placeholder="email"
                    value={formData.email}
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
              </Stack>
              <div>
                <FormControl>
                  <FormLabel>License</FormLabel>
                  <Input
                    size="sm"
                    value={formData.license}
                    onChange={(e) =>
                      handleInputChange("license", e.target.value)
                    }
                  />
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    size="sm"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </FormControl>
              </div>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={108}
                  sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 85,
                    top: 180,
                    boxShadow: "sm",
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: "flex-column",
                      md: "flex-row",
                    },
                    gap: 2,
                  }}
                >
                  <Input
                    size="sm"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    size="sm"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input size="sm" value={formData.role} readOnly />
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Input
                size="sm"
                type="email"
                startDecorator={<EmailRoundedIcon />}
                placeholder="email"
                value={formData.email}
                readOnly
                sx={{ flexGrow: 1 }}
              />
            </FormControl>
            <div>
              <FormControl>
                <FormLabel>License</FormLabel>
                <Input
                  size="sm"
                  value={formData.license}
                  onChange={(e) => handleInputChange("license", e.target.value)}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  size="sm"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </FormControl>
            </div>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid" onClick={handleSaveButtonClick}>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        {updateMessage && (
          <ShowMessage
            openvalue={updateMessage.open}
            message={updateMessage.message}
            status={updateMessage.status}
          />
        )}
      </Stack>
    </Box>
  );
}
