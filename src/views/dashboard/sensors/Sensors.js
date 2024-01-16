import React, { useEffect, useState } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchIcon from "@mui/icons-material/Search";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Autocomplete, ButtonGroup, Card, Chip } from "@mui/joy";
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
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  deleteSensor,
  getSensors,
  updateSensor,
} from "../../../apis/SensorController.js";
import { fetchUserInfo, getUsers } from "../../../apis/UserController.js";
import Layout from "../../Navbar/Layout.tsx";
import CreateSensor from "./CreateSensor.js";
import SmallTable from "./SmallTable.js";
import TableFiles from "./TableFiles.js";

export default function Sensors() {
  const { t } = useTranslation("translation");
  const [newSensorAdd, setNewSensorAdd] = React.useState("");
  const { register, handleSubmit } = useForm();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [dataLength, setDataLength] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [sensors, setSensors] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [sensorTypes, setSensorTypes] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [sensorTypeValue, setSensorTypeValue] = React.useState(null);
  const [userRole, SetUserRole] = React.useState(null);
  const [userEmail, setUseremail] = React.useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetchUserInfo();
        console.log("res", res.role);
        SetUserRole(res.role);
        setUseremail(res.license);
      } catch (error) {}
    };

    fetchUserRole();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(initialFormData);
  };

  const fetchSensorType = async () => {
    try {
      const responseSensor = await getSensors();
      setSensorTypes(
        Array.from(
          new Set(
            responseSensor.data.map((sensor) => ({
              id: sensor.sensorTypeId._id,
              type: sensor.sensorTypeId.type,
            }))
          )
        )
      );
      setDataLength(responseSensor.data.length);
    } catch (error) {}
  };

  useEffect(() => {
    fetchSensorType();
  }, [open, newSensorAdd]);
  const [prevPage, setPrevPage] = useState(0);

  useEffect(() => {
    setPrevPage((prev) => Math.max(prev, page));
  }, [page, open]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const newData = await getSensors("", page * rowsPerPage, rowsPerPage);
        // Create an array of promises for the additional requests
        const additionalRequests = newData.data.map(async (row) => {
          const firstAdditionalInfo = await getUsers(
            `{"_id":"${row.createdBy}"}`
          );
          return {
            ...row,
            user: `${firstAdditionalInfo[0]?.firstName} ${
              firstAdditionalInfo[0]?.lastName || ""
            }`,
            useremail: firstAdditionalInfo[0]?.license,
          };
        });

        // Wait for all additional requests to complete
        const additionalResults = await Promise.all(additionalRequests);

        if (page === 0) {
          setSensors(additionalResults);
          setPrevPage(0);
        } else {
          setSensors((prevData) => {
            return [...prevData, ...additionalResults];
          });
        }
      } catch (error) {}
    };
    if (
      page == 0 ||
      (page > prevPage && prevPage != Math.ceil(dataLength / rowsPerPage) - 1)
    ) {
      fetchSensors();
    }

    console.log(sensors[page * rowsPerPage + selectedRow]);
  }, [rowsPerPage, page, open, isEditing, newSensorAdd]);

  const [searchText, setSearchText] = useState("");
  const [selectedPropertyValue, setSelectedPropertyValue] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const queryObject = {};

      if (searchText) {
        queryObject.name = searchText;
      }

      if (selectedPropertyValue !== null) {
        queryObject.serialNo = selectedPropertyValue;
      }

      if (selectedManufacturer !== null) {
        queryObject.manufacturer = selectedManufacturer;
      }
      const queryString = JSON.stringify(queryObject);
      // Make the API request using Axios with the constructed query object
      const response = await getSensors(queryString);
      setDataLength(response.data.length);
      const additionalRequests = response.data.map(async (row) => {
        const firstAdditionalInfo = await getUsers(
          `{"_id":"${row?.createdBy}"}`
        ); // Replace with your actual method

        return {
          ...row,
          user: `${firstAdditionalInfo[0]?.firstName} ${
            firstAdditionalInfo[0]?.lastName || ""
          }`,
          useremail: firstAdditionalInfo[0]?.license,
        };
      });

      // Wait for all additional requests to complete
      const additionalResults = await Promise.all(additionalRequests);
      setSensors(additionalResults);
    } catch (error) {
      setSensors([]);
      console.error("Error fetching :", error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const res = await updateSensor(
        sensors[page * rowsPerPage + selectedRow]?._id,
        {
          name: formData.name,
          observes: formData.observes,
          serialNo: formData.serialNo,
          sensorTypeId: formData.sensorType,
        }
      );
      // Reset the state and hide the form
      setIsEditing(false);
    } catch (error) {
      // Handle errors as needed
      console.error("Error updating sensor type:", error);
    }
  };

  const deleteSensors = async () => {
    try {
      console.log(sensors[page * rowsPerPage + selectedRow]);
      const response = await deleteSensor(
        sensors[page * rowsPerPage + selectedRow]?._id
      );

      setSelectedRow(0);
    } catch (error) {
      console.error("Error deleting sensor type:", error);
    }
  };

  const filedetails = [
    {
      label: "Name",
      value: sensors[page * rowsPerPage + selectedRow]?.name || "Unnamed",
    },
    {
      label: "Serial No",
      value:
        sensors[page * rowsPerPage + selectedRow]?.serialNo || "Not defined",
    },

    {
      label: "observes",
      value: sensors[page * rowsPerPage + selectedRow]?.observes,
    },
    {
      label: `${t("Sensors.author")}`,
      value: sensors[page * rowsPerPage + selectedRow]?.user || "",
    },
    {
      label: "Sensor Type",
      value: sensors[page * rowsPerPage + selectedRow]?.sensorTypeId?.type,
    },
  ];

  const initialFormData = {
    name: sensors[page * rowsPerPage + selectedRow]?.name,
    sensorType: sensors[page * rowsPerPage + selectedRow]?.sensorTypeId?.type,
    observes: sensors[page * rowsPerPage + selectedRow]?.observes,
    serialNo: sensors[page * rowsPerPage + selectedRow]?.serialNo,
  };
  const [formData, setFormData] = React.useState(initialFormData);
  useEffect(() => {
    setFormData({
      name: sensors[page * rowsPerPage + selectedRow]?.name,
      sensorType: sensors[page * rowsPerPage + selectedRow]?.sensorTypeId?.type,
      observes: sensors[page * rowsPerPage + selectedRow]?.observes,
      serialNo: sensors[page * rowsPerPage + selectedRow]?.serialNo,
    });
  }, [selectedRow]);
  const handleCancelClick = () => {
    // Reset the state and hide the form
    setIsEditing(false);
    setFormData(initialFormData);
  };

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
          <form onSubmit={handleSearch} style={{ padding: "0px" }}>
            <Box sx={{ width: 1 }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 9">
                  <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Search for Sensor</FormLabel>
                    <Input
                      size="sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
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

                <Box gridColumn="span 4">
                  <FormControl size="sm">
                    <FormLabel>Serial No</FormLabel>
                    <Input
                      size="sm"
                      value={searchText}
                      onChange={(e) => setSelectedPropertyValue(e.target.value)}
                      placeholder={t("Obs.search")}
                    />
                  </FormControl>
                </Box>
                <Box gridColumn="span 4">
                  <FormControl size="sm">
                    <FormLabel>Observes</FormLabel>

                    <Input
                      size="sm"
                      value={searchText}
                      onChange={(e) => setSelectedPropertyValue(e.target.value)}
                      placeholder={t("Obs.search")}
                    />
                  </FormControl>
                </Box>
                <Box gridColumn="span 4">
                  <FormControl size="sm">
                    <FormLabel>Sensor Type</FormLabel>
                    <Autocomplete
                      size="sm"
                      autoHighlight
                      {...register("manufacturer")}
                      options={sensorTypes}
                      getOptionLabel={(option) => option.type}
                      getOptionValue={(option) => option.id}
                      value={
                        sensorTypes.find(
                          (option) => option === selectedManufacturer
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        setSelectedManufacturer(newValue || null)
                      }
                      placeholder={t("Obs.all")}
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
              rows={sensors}
              dataLength={dataLength}
              rowsPerPage={rowsPerPage}
              page={page}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </Sheet>
          <SmallTable items={sensors} />
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
            {sensors[page * rowsPerPage + selectedRow]?.name || "Unnamed"}
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
              <Typography level="title-sm">{t("Sensors.details")}</Typography>
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ p: 0 }}>
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
                    {Array.isArray(item.value)
                      ? item.value.map((prop, propIndex) => (
                          <Chip key={propIndex} sx={{ m: 0.5 }}>
                            {prop}
                          </Chip>
                        ))
                      : item.value}
                  </div>
                </React.Fragment>
              ))}
            </Box>
            <Divider />
            <Box sx={{ py: 2, px: 1 }}>
              {isEditing ? (
                // Display the form when editing
                <form style={{ padding: 0 }}>
                  <FormControl sx={{ paddingBottom: 1, width: "90%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={formData?.name}
                      onChange={handleChange}
                      label="Type"
                      name="type"
                      variant="outlined"
                      size="md"
                    />
                  </FormControl>
                  <FormControl sx={{ paddingBottom: 1, width: "90%" }}>
                    <FormLabel>Serial No</FormLabel>
                    <Input
                      value={formData?.serialNo}
                      onChange={handleChange}
                      label="Type"
                      name="type"
                      variant="outlined"
                      size="md"
                    />
                  </FormControl>
                  <FormControl sx={{ paddingBottom: 1, width: "90%" }}>
                    <FormLabel>Observes</FormLabel>
                    <Input
                      size="md"
                      name="manufacturer"
                      value={formData?.observes}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl sx={{ paddingBottom: 1 }}>
                    <FormLabel>Sensor Type</FormLabel>
                    <Box display="flex" sx={{ alignItems: "center" }}>
                      <Autocomplete
                        size="md"
                        sx={{ minWidth: "21.15rem" }}
                        autoHighlight
                        value={
                          sensorTypeValue ||
                          sensorTypes.find(
                            (option) => option.id === formData.sensorType
                          ) ||
                          null
                        }
                        options={sensorTypes}
                        getOptionLabel={(option) => option.type}
                        getOptionValue={(option) => option.id}
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            sensorType: newValue?.id,
                          });
                          setSensorTypeValue(newValue);
                        }}
                        placeholder={sensorTypeValue}
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
                    </Box>
                  </FormControl>

                  <ButtonGroup
                    spacing="0.5rem"
                    aria-label="spacing button group"
                  >
                    <Button
                      onClick={handleSaveClick}
                      color="primary"
                      variant="soft"
                    >
                      {t("Obs.update")}
                    </Button>

                    <Button
                      onClick={handleCancelClick}
                      color="warning"
                      variant="soft"
                    >
                      {t("Settings.cancel")}
                    </Button>
                  </ButtonGroup>
                </form>
              ) : (
                // Display the edit and delete buttons when not editing
                <Box sx={{ py: 1, px: 1 }}>
                  <CreateSensor setNewSensorAdd={setNewSensorAdd} />
                  {userRole === "user" &&
                  sensors[page * rowsPerPage + selectedRow]?.useremail ===
                    userEmail ? (
                    <>
                      <Button
                        variant="plain"
                        color="neutral"
                        size="sm"
                        startDecorator={<EditRoundedIcon />}
                        onClick={handleEditClick}
                      >
                        {t("Sensors.edit")}
                      </Button>
                      <Button
                        variant="plain"
                        color="warning"
                        size="sm"
                        onClick={() => setOpen(true)}
                        startDecorator={<DeleteIcon />}
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
                                  sensors[page * rowsPerPage + selectedRow]
                                    ?.name
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
                                deleteSensors();
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
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              )}
            </Box>
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}
