import React, { useEffect, useState } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Card } from "@mui/joy";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import Typography from "@mui/joy/Typography";
import { Autocomplete, TextField } from "@mui/material";
import dateFormat from "dateformat";
import { useTranslation } from "react-i18next";
import { getCaveById } from "../../../apis/CaveController.js";
import {
  deleteObservation,
  searchObservations,
} from "../../../apis/CaveObservationController.js";
import { getSensors } from "../../../apis/SensorController.js";
import { fetchUserInfo, getUsers } from "../../../apis/UserController.js";
import caveImage from "../../../images/cave_map.png";
import Layout from "../../Navbar/Layout.tsx";
import EditObservation from "./EditObservation.js";
import SmallTable from "./SmallTable.js";
import TableFiles from "./TableFiles";

export default function Observations() {
  const { t } = useTranslation("translation");
  const [observations, setObservations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [dataLength, setDataLength] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(0); // Store the selected row index
  const [open, setOpen] = React.useState(false);
  const [sensorOptions, setSensorOptions] = useState([]); // Separate state for sensor options
  const [userNameOptions, setUserNameOptions] = useState([]); // Separate state for user name options
  const [auxDeleteFile, setAuxDeleteFile] = useState(0);
  const [userRole, SetUserRole] = React.useState(null);
  const [userlicense, setUserlicense] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetchUserInfo();
        setUserId(res._id);
        SetUserRole(res.role);
        setUserlicense(res.license);
      } catch (error) {}
    };

    fetchUserRole();
  }, []);

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
      const responseSensor = await getSensors();

      setSensorOptions(
        responseSensor.data.map((sensor) => ({
          type: sensor?.name,
          id: sensor._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching sensor types:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const allObservations = await searchObservations();

        const filteredObservations = allObservations.filter(
          (row) =>
            (userRole === "user" && userId === row.createdBy) ||
            userRole === "admin"
        );

        setDataLength(filteredObservations.length);
      } catch (error) {}
    };

    fetchObservations();
    fetchSensorType();
    fetchUserName();
  }, [userId, auxDeleteFile]);
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
        const additionalRequests = newData
          .filter(
            (row) =>
              (userRole === "user" && userId === row.createdBy) ||
              userRole === "admin"
          )
          .map(async (row) => {
            const firstAdditionalInfo = await getUsers(
              `{"_id":"${row.createdBy}"}`
            );
            return {
              ...row,
              user: `${firstAdditionalInfo[0]?.firstName} ${
                firstAdditionalInfo[0]?.lastName || ""
              }`,
              license: firstAdditionalInfo[0]?.license,
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
  }, [rowsPerPage, page, dataLength]);

  const [searchText, setSearchText] = useState("");
  const [selectedSensorId, setSelectedSensorId] = useState(null);
  const [selectedUserNameId, setSelectedUserNameId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Use the searchText, selectedSensorId, and selectedUserNameId values for your search logic

    try {
      const queryObject = {};

      if (searchText) {
        queryObject.fileName = searchText;
      }

      if (selectedSensorId !== null) {
        queryObject.sensorId = selectedSensorId;
      }

      if (selectedUserNameId !== null) {
        queryObject.createdBy = selectedUserNameId;
      }
      const queryString = JSON.stringify(queryObject);
      // Make the API request using Axios with the constructed query object
      const response = await searchObservations(queryString);

      const additionalRequests = response
        .filter(
          (row) =>
            (userRole === "user" && userId === row.createdBy) ||
            userRole === "admin"
        )
        .map(async (row) => {
          const firstAdditionalInfo = await getUsers(
            `{"_id":"${row.createdBy}"}`
          ); // Replace with your actual method

          return {
            ...row,
            user: `${firstAdditionalInfo[0]?.firstName} ${
              firstAdditionalInfo[0]?.lastName || ""
            }`,
            license: firstAdditionalInfo[0]?.license,
          };
        });

      // Wait for all additional requests to complete
      const additionalResults = await Promise.all(additionalRequests);
      setObservations(additionalResults);
      setDataLength(observations.length);
    } catch (error) {
      setObservations([]);
      console.error("Error fetching observations:", error);
    }
  };

  useEffect(() => {
    const fetchObservationDetails = async () => {
      try {
        const caveInfo = await getCaveById(
          observations[page * rowsPerPage + selectedRow].caveId
        );

        // Wrap the sensor request in a try-catch block

        setObservations((prevObservations) => {
          const updatedObservations = [...prevObservations];
          const updatedRow = {
            ...updatedObservations[page * rowsPerPage + selectedRow],
          };

          // Add additional details to the updated row
          updatedRow.sensor =
            observations[
              page * rowsPerPage + selectedRow
            ]?.isObservedBy?.sensorTypeId?.type;
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
  }, [selectedRow, page, rowsPerPage, observations[0]?.fileName]);

  const filedetails = [
    {
      label: `${t("Obs.table.file-name")}`,
      value:
        observations[page * rowsPerPage + selectedRow]?.fileName || "Unnamed",
    },
    {
      label: `${t("Contribute.sensor")}`,
      value:
        observations[page * rowsPerPage + selectedRow]?.isObservedBy?.name ||
        observations[page * rowsPerPage + selectedRow]?.isObservedBy
          ?.serialNo ||
        "Not found",
    },
    {
      label: `${t("Obs.table.sensor")}`,
      value:
        observations[page * rowsPerPage + selectedRow]?.sensor || "Not found",
    },

    {
      label: `${t("Obs.location")}`,
      value: observations[page * rowsPerPage + selectedRow]?.location || "",
    },
    {
      label: `${t("Obs.author")}`,
      value: observations[page * rowsPerPage + selectedRow]?.user || "",
    },
    {
      label: `${t("Obs.table.begin-date")}`,
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
      label: `${t("Obs.table.end-date")}`,
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
      label: `${t("Obs.added-date")}`,
      value: `${dateFormat(
        observations[page * rowsPerPage + selectedRow]?.createdAt,
        "ddd, mmm dS, yyyy"
      )} at ${dateFormat(
        observations[page * rowsPerPage + selectedRow]?.createdAt,
        "h:MM:ss TT"
      )}`,
    },
  ];
  const deleteFile = async () => {
    try {
      const observationIdToDelete =
        observations[page * rowsPerPage + selectedRow]?.id;
      const response = await deleteObservation(observationIdToDelete);
      setObservations((prevObservations) => {
        return prevObservations.filter(
          (observation) => observation.id !== observationIdToDelete
        );
      });
      setAuxDeleteFile((prevAuxDeleteFile) => prevAuxDeleteFile + 1);
      // Update the selected row
      setSelectedRow((prevSelectedRow) => Math.max(prevSelectedRow - 1, 0));
    } catch (error) {
      console.error("Error deleting sensor type:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(450px, 1fr)",
          md: "  minmax(500px, 1fr) minmax(250px, 410px)",
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
          <form onSubmit={handleSearch} style={{ padding: "0px" }}>
            <Box sx={{ width: 1 }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 9">
                  <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>{t("Obs.serach-label")}</FormLabel>
                    <Input
                      size="sm"
                      placeholder={t("Obs.search")}
                      startDecorator={<SearchIcon />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
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
                      options={sensorOptions} // Assuming sensorOptions is an array of objects with id and type properties
                      getOptionLabel={(option) => option.type}
                      getOptionValue={(option) => option.id} // Assuming id is the property you want to capture
                      value={
                        sensorOptions.find(
                          (option) => option.id === selectedSensorId
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        setSelectedSensorId(newValue?.id || null)
                      }
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
                      disabled={userRole !== "admin"}
                      autoHighlight
                      id="createdBy"
                      options={userNameOptions} // Assuming userNameOptions is an array of objects with id and name properties
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id} // Assuming id is the property you want to capture
                      value={
                        userNameOptions.find(
                          (option) => option.id === selectedUserNameId
                        ) || null
                      }
                      sx={{ width: "100%" }}
                      onChange={(e, newValue) =>
                        setSelectedUserNameId(newValue?.id || null)
                      }
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
          <Typography
            level="title-md"
            sx={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
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
              <Typography level="title-sm">{t("Obs.details")}</Typography>
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ p: 0 }}>
            <AspectRatio ratio="21/8">
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
                  <Typography level="title-sm">{item?.label}</Typography>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#171A1C",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      width: "240px",
                    }}
                  >
                    {item?.value}
                  </div>
                </React.Fragment>
              ))}
            </Box>
            <Divider />
            {(userRole === "user" &&
              observations[page * rowsPerPage + selectedRow]?.license ===
                userlicense) ||
            userRole === "admin" ? (
              <>
                <Box sx={{ py: 2, px: 1 }}>
                  {/* <EditObservation
                    obsvalue={observations[page * rowsPerPage + selectedRow]}
                  /> */}
                  <Button
                    variant="plain"
                    color="warning"
                    size="sm"
                    onClick={() => setOpen(true)}
                    endDecorator={<DeleteIcon />}
                  >
                    {t("Sensors.delete")}
                  </Button>
                  <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog variant="outlined" role="alertdialog">
                      <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                      </DialogTitle>
                      <Divider />
                      <DialogContent>
                        <div>
                          {t("Sensors.delete-message")}{" "}
                          <strong>
                            {
                              observations[page * rowsPerPage + selectedRow]
                                ?.fileName
                            }
                          </strong>{" "}
                          ?
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="solid"
                          color="danger"
                          onClick={() => {
                            deleteFile();
                            setOpen(false);
                          }}
                        >
                          {t("Sensors.delete")}
                        </Button>
                        <Button
                          variant="plain"
                          color="neutral"
                          onClick={() => setOpen(false)}
                        >
                          {t("Settings.cancel")}
                        </Button>
                      </DialogActions>
                    </ModalDialog>
                  </Modal>
                </Box>
              </>
            ) : (
              <></>
            )}
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}
