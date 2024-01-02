import React, { useEffect, useState } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchIcon from "@mui/icons-material/Search";
import { Card } from "@mui/joy";
import dateFormat from "dateformat";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import Typography from "@mui/joy/Typography";
import { Autocomplete, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getCaveById } from "../../../apis/CaveController.js";
import { searchObservations } from "../../../apis/CaveObservationController.js";
import {
  getSensorTypeById,
  getSensorTypes,
} from "../../../apis/SensorTypeController.js";
import { getUsers } from "../../../apis/UserController.js";
import caveImage from "../../../images/cave_map.png";
import Layout from "../../Navbar/Layout.tsx";
import SmallTable from "./SmallTable.js";
import TableFiles from "./TableFiles";

export default function Observations() {
  const { t } = useTranslation("translation");
  const [observations, setObservations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [dataLength, setDataLength] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(0); // Store the selected row index

  const [sensorOptions, setSensorOptions] = useState([]); // Separate state for sensor options
  const [userNameOptions, setUserNameOptions] = useState([]); // Separate state for user name options
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const fetchUserName = async () => {
    try {
      const responseUserNames = await getUsers(); // Assuming there's a function to fetch user names
      setUserNameOptions(
        responseUserNames.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          id: user._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching user names:", error);
      // Handle errors as needed
    }
  };
  const fetchSensorType = async () => {
    try {
      const responseSensor = await getSensorTypes();
      setSensorOptions(
        responseSensor.map((sensor) => ({ type: sensor.type, id: sensor._id }))
      );
    } catch (error) {
      console.error("Error fetching sensor types:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const data = await searchObservations();
        setDataLength(data.length);
      } catch (error) {}
    };

    fetchObservations();
    fetchSensorType();
    fetchUserName();
    console.log("sensorOptions", sensorOptions);
  }, []);
  const [prevPage, setPrevPage] = useState(0);

  useEffect(() => {
    setPrevPage((prev) => Math.max(prev, page));
  }, [page]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const newData = await searchObservations(
          "",
          page * rowsPerPage,
          rowsPerPage
        );
        // Create an array of promises for the additional requests
        const additionalRequests = newData.map(async (row) => {
          const firstAdditionalInfo = await getUsers(
            `{"_id":"${row.createdBy}"}`
          ); // Replace with your actual method

          return {
            ...row,
            user: `${firstAdditionalInfo[0].firstName} ${firstAdditionalInfo[0].lastName}`,
          };
        });

        // Wait for all additional requests to complete
        const additionalResults = await Promise.all(additionalRequests);

        if (page === 0) {
          setObservations(additionalResults);
          setPrevPage(0);
        } else {
          setObservations((prevData) => {
            return [...prevData, ...additionalResults];
          });
        }
      } catch (error) {}
    };
    if (
      page == 0 ||
      (page > prevPage && prevPage != Math.ceil(dataLength / rowsPerPage) - 1)
    ) {
      fetchObservations();
    }
    setSelectedRow(0);
  }, [rowsPerPage, page]);

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  useEffect(() => {
    const fetchObservationDetails = async () => {
      try {
        const caveInfo = await getCaveById(
          observations[page * rowsPerPage + selectedRow].caveId
        );

        // Wrap the sensor request in a try-catch block
        let sensor;
        try {
          sensor = await getSensorTypeById(
            observations[page * rowsPerPage + selectedRow]?.sensorId
          );
        } catch (sensorError) {
          console.error("Error fetching sensor details", sensorError);
          // Handle sensor request error
          sensor = { data: { type: "Not found" } }; // Provide a default value
        }

        console.log(sensor);

        setObservations((prevObservations) => {
          const updatedObservations = [...prevObservations];
          const updatedRow = {
            ...updatedObservations[page * rowsPerPage + selectedRow],
          };

          // Add additional details to the updated row
          updatedRow.sensor = sensor?.data?.type;
          updatedRow.location = `${caveInfo.name}, ${caveInfo.entrances[0].city}, ${caveInfo.entrances[0].country}`;

          // Update the array with the modified row
          updatedObservations[page * rowsPerPage + selectedRow] = updatedRow;

          return updatedObservations;
        });
      } catch (error) {
        console.error("Error fetching additional details", error);
        // Handle error
      }
    };

    fetchObservationDetails();
    console.log("New data", observations);
  }, [selectedRow]);
  const filedetails = [
    {
      label: "File",
      value:
        observations[page * rowsPerPage + selectedRow]?.fileName || "Unnamed",
    },
    {
      label: "Sensor",
      value:
        observations[page * rowsPerPage + selectedRow]?.sensor || "Not defined",
    },

    {
      label: "Location",
      value: observations[page * rowsPerPage + selectedRow]?.location || "",
    },
    {
      label: "Owner",
      value: observations[page * rowsPerPage + selectedRow]?.user || "",
    },
    {
      label: "Begin Date",
      value:
        `${dateFormat(
          observations[page * rowsPerPage + selectedRow]?.beginDate,
          "ddd, mmm dS, yyyy"
        )} at ${dateFormat(
          observations[page * rowsPerPage + selectedRow]?.beginDate,
          "h:MM:ss TT"
        )}` || "No date",
    },
    {
      label: "End Date",
      value:
        `${dateFormat(
          observations[page * rowsPerPage + selectedRow]?.endDate,
          "ddd, mmm dS, yyyy"
        )} at ${dateFormat(
          observations[page * rowsPerPage + selectedRow]?.endDate,
          "h:MM:ss TT"
        )}` || "No date",
    },
    {
      label: "Created",
      value: `${dateFormat(
        observations[page * rowsPerPage + selectedRow]?.createdAt,
        "ddd, mmm dS, yyyy"
      )} at ${dateFormat(
        observations[page * rowsPerPage + selectedRow]?.createdAt,
        "h:MM:ss TT"
      )}`,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(450px, 1fr)",
          md: "  minmax(550px, 1fr) minmax(250px, 400px)",
        },

        minHeight: "92vh",
      }}
    >
      <Layout.Main>
        <Card
          variant="outlined"
          display="grid"
          gridTemplateColumns="repeat(12, 500)"
          gap={2}
          sx={{
            borderRadius: "sm",
            py: 1,
            maxHeight: "max-content",
            maxWidth: "100%",
            paddingBottom: 2,
            marginBottom: 2,
            "& > *": {
              minWidth: {
                xs: "300px",
                md: "350px",
              },
            },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "0px" }}>
            <Box sx={{ width: 1 }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 9">
                  <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>{t("Obs.serach-label")}</FormLabel>
                    <Input
                      size="sm"
                      placeholder={t("Obs.search")}
                      startDecorator={<SearchIcon />}
                    />
                  </FormControl>
                </Box>
                <Box
                  gridColumn="span 3"
                  justifyContent="flex-end"
                  sx={{ marginTop: "auto" }}
                >
                  <Button type="submit" sx={{ height: "38px", width: "100%" }}>
                    {t("Search.search")}
                  </Button>
                </Box>

                <Box gridColumn="span 6">
                  <FormControl size="sm">
                    <Autocomplete
                      size="small"
                      autoHighlight
                      {...register("sensorId")}
                      options={sensorOptions.map((option) => option.type)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("Contribute.sensor")}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
                <Box gridColumn="span 6">
                  <FormControl size="sm">
                    <Autocomplete
                      size="small"
                      {...register("userName")}
                      autoHighlight
                      id="userName"
                      options={userNameOptions.map((option) => option.name)}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                          }}
                          label={t("Obs.author")}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </form>
        </Card>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 2,
          }}
        >
          {" "}
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "sm",
              gridColumn: "1/-1",
              display: { xs: "none", md: "flex" },
            }}
          >
            <TableFiles
              data={observations}
              dataLength={dataLength}
              rowsPerPage={rowsPerPage}
              page={page}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </Sheet>
          <SmallTable items={observations} />
        </Box>
      </Layout.Main>
      <Sheet
        sx={{
          display: { xs: "none", sm: "initial" },
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Typography level="title-md" sx={{ flex: 1 }}>
            {observations[page * rowsPerPage + selectedRow]?.fileName ||
              "Unnamed"}
          </Typography>
          <IconButton
            component="span"
            variant="plain"
            color="neutral"
            size="sm"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider />
        <Tabs>
          <TabList>
            <Tab sx={{ flexGrow: 1 }}>
              <Typography level="title-sm">Details</Typography>
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ p: 0 }}>
            <AspectRatio ratio="21/9">
              <img alt="" src={caveImage} />
            </AspectRatio>
            <Divider />

            <Box
              sx={{
                gap: 2,
                p: 2,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                "& > *:nth-child(odd)": { color: "text.secondary" },
              }}
            >
              {filedetails.map((item, index) => (
                <React.Fragment key={index}>
                  <Typography level="title-sm">{item.label}</Typography>
                  <div style={{ fontSize: "14px", color: "#171A1C" }}>
                    {item.value}
                  </div>
                </React.Fragment>
              ))}
            </Box>
            <Divider />
            <Box sx={{ py: 2, px: 1 }}>
              <Button
                variant="plain"
                size="sm"
                endDecorator={<EditRoundedIcon />}
              >
                Edit
              </Button>
              <Button
                variant="plain"
                color="warning"
                size="sm"
                endDecorator={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}