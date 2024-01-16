import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import * as React from "react";

import Typography from "@mui/joy/Typography";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

// icons
import dayjs, { Dayjs } from "dayjs";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { searchObservations } from "../../apis/CaveObservationController.js";
import { getSensorTypeById } from "../../apis/SensorTypeController.js";
import { getUsers } from "../../apis/UserController.js";
import FileList from "./FileList.tsx";
import FileTable from "./FileTable.tsx";

const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export default function ObservationFiles() {
  const { id } = useParams();
  const [rows, setRows] = React.useState([
    {
      id: "",
      fileName: "",
      sensor_type: "",
      beginDate: "",
      endDate: "",
      customer: { initial: "", name: "", email: "" },
    },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await searchObservations(`{"caveId":"${id}"}`);
        const responses = await Promise.all(
          data.map(async (item) => {
            const formattedBeginDate = item?.beginDate
              ? dayjs(item?.beginDate).format("MMM DD, YYYY")
              : "no_date";
            const formattedEndDate = item?.endDate
              ? dayjs(item?.endDate).format("MMM DD, YYYY")
              : "no_date";
            const fileName = item?.fileName || "file.csv";
            const resUser = await getUsers(`{"_id":"${item?.createdBy}"}`);

            const sensorType = item?.isObservedBy?.sensorTypeId?.type || "";

            return {
              ...item,
              sensor_type: sensorType,
              beginDate: formattedBeginDate,
              endDate: formattedEndDate,
              fileName: fileName,
              customer: {
                initial: resUser[0]?.lastName.charAt(0).toUpperCase(),
                name: `${resUser[0]?.firstName} ${resUser[0]?.lastName || ""}`,
              },
            };
          })
        );
        setRows(responses);
      } catch (error) {
        setRows([]);

        console.error("Error fetching observation types:", error);
        // Handle errors as needed
      }
    };

    fetchData();
  }, [rows[0]?.id]);

  const { t } = useTranslation("translation");

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "92.5vh" }}>
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 2,
            },

            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "90dvh",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              my: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2">{t("Obs.title")}</Typography>
            <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              {t("Obs.download")}
            </Button>
          </Box>
          <FileTable rows={rows} />
          <FileList listItems={rows} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
