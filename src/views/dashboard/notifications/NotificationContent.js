import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RestoreIcon from "@mui/icons-material/Restore";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Sheet from "@mui/joy/Sheet";
import Snackbar from "@mui/joy/Snackbar";
import Typography from "@mui/joy/Typography";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import * as React from "react";
import { getUsers } from "../../../apis/UserController";
import { useTranslation } from "react-i18next";
import { restoreSensorType } from "../../../apis/SensorTypeController";
import { restoreSensor } from "../../../apis/SensorController";
import { restoreObservations } from "../../../apis/CaveObservationController";

export default function NotificationContent({ selectedNotification }) {
  const [open, setOpen] = React.useState([false, false, false]);
  const [itemTypeId, setItemTypeId] = React.useState("");
  const { t } = useTranslation("translation");

  const handleSnackbarOpen = async (index) => {
    try {
      if (selectedNotification.itemType === "Observation") {
        const res = await restoreObservations(
          selectedNotification.caveObservation.id
        );
      } else if (selectedNotification.itemType === "Sensor") {
        const res = await restoreSensor(selectedNotification.sensor._id);
      } else if (selectedNotification.itemType === "SensorType") {
        const res = await restoreSensorType(
          selectedNotification.sensorType._id
        );
      }

      const updatedOpen = [...open];
      updatedOpen[index] = true;
      setOpen(updatedOpen);
    } catch (e) {
      console.log("error restore", e);
    }
  };

  const handleSnackbarClose = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  const [author, setAuthor] = React.useState("user1");

  React.useEffect(() => {
    if (
      (selectedNotification?.itemType === "Observation" &&
        !selectedNotification?.caveObservation?.createdBy) ||
      (selectedNotification?.itemType === "SensorType" &&
        !selectedNotification?.sensorType?.createdBy)
    ) {
      // If it doesn't exist, you can return early or handle it as per your requirement.
      console.log("createdBy does not exist. Skipping request.");
      return;
    }
    const fetchAuthor = async () => {
      let res;
      try {
        if (selectedNotification?.itemType === "Observation") {
          res = await getUsers(
            `{"_id":"${selectedNotification?.caveObservation?.createdBy}"}`
          );
        } else if (selectedNotification?.itemType === "SensorType") {
          res = await getUsers(
            `{"_id":"${selectedNotification?.sensorType?.createdBy}"}`
          );
        }
        if (res.length > 0) {
          setAuthor(`${res[0].firstName} ${res[0].lastName}`);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };
    fetchAuthor();
  }, [selectedNotification?.caveObservation?.createdBy]);

  const generateMessage = (notification) => {
    const itemType = notification?.itemType;
    const caveObservation = notification?.caveObservation;
    const sensorType = notification?.sensorType;
    const deletedBy = notification?.deletedBy;
    const notificationType = notification?.notificationType;
    const { caveId, fileName, beginDate, endDate } = caveObservation || {};
    const { type, properties, creator, manufacturer } = sensorType || {};
    const firstName = deletedBy?.firstName || "Anonymous";
    const lastName = deletedBy?.lastName || "123";

    let message;
    let additionalDescription;

    if (notificationType === "SoftDelete") {
      if (itemType === "Observation" && caveId) {
        message = (
          <div>
            {t("Notifications.content-obs1")} <strong>{fileName}</strong>{" "}
            {t("Notifications.content-obs2")}{" "}
            <strong>
              {firstName} {lastName}
            </strong>
            .
          </div>
        );
        additionalDescription = (
          <div>
            {t("Notifications.content-obs3")}{" "}
            <strong>{author || "user1"}</strong>{" "}
            {t("Notifications.content-obs4")}{" "}
            <strong>
              {dayjs(caveObservation?.createdAt).format("MMM D, YYYY hh:mm")}
            </strong>
            .<br />
            <br /> {t("Notifications.content-obs5")} <strong>{caveId}</strong>{" "}
            {t("Notifications.content-obs6")}{" "}
            <strong>{caveObservation?.timeZone}</strong>.
            <br />
            <br />
            {t("Notifications.content-obs7")}{" "}
            <strong>
              {dayjs(beginDate).format("MMM D, YYYY hh:mm") || "no_date"}
            </strong>{" "}
            {t("Notifications.content-obs8")}{" "}
            <strong>
              {dayjs(endDate).format("MMM D, YYYY hh:mm") || "no_date"}
            </strong>
            .
          </div>
        );
      } else if (itemType === "SensorType" && type) {
        message = (
          <div>
            {t("Notifications.content-sensor1")} <strong>"{type}"</strong>{" "}
            {t("Notifications.content-sensor2")}{" "}
            <strong>
              {firstName} {lastName}
            </strong>
            .
          </div>
        );
        additionalDescription = (
          <div>
            {t("Notifications.content-sensor3")}
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingLeft: "30px" }}>
                    <strong>{t("Notifications.content-sensor4")}</strong>
                  </td>
                  <td>{properties ? properties.join(", ") : "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: "30px" }}>
                    <strong>{t("Notifications.content-sensor5")}</strong>
                  </td>
                  <td>{author || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: "30px" }}>
                    <strong>{t("Notifications.content-sensor6")}</strong>
                  </td>
                  <td>{manufacturer || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      } else {
        message = `The ${itemType.toLowerCase()} has been soft-deleted by ${firstName} ${lastName}.`;
      }
    } else {
      // Handle other notification types or customize the message for non-SoftDelete types
      message = `SoftDelete notification for ${itemType}.`;
      additionalDescription = (
        <div>No Additional details for SoftDelete notification.</div>
      );
    }

    return (
      <>
        {message}
        <br />

        {additionalDescription}
      </>
    );
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
              {selectedNotification?.deletedBy?.firstName || "Undefined"}{" "}
              {selectedNotification?.deletedBy?.lastName}
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              {dateFormat(selectedNotification?.createdAt, "ddd, mmm dS, yyyy")}{" "}
              at {dateFormat(selectedNotification?.createdAt, "h:MM:ss TT")}
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
            color="primary"
            startDecorator={<RestoreIcon />}
            onClick={() => handleSnackbarOpen(2)}
          >
            Restore
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
            Your {selectedNotification?.itemType} has been restored.
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
          {selectedNotification?.title}: {selectedNotification?.itemType}
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
        {generateMessage(selectedNotification)}
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
