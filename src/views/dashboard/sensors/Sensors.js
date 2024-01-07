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
  deleteSensorType,
  getSensorTypes,
  updateSensorType,
} from "../../../apis/SensorTypeController.js";
import { getUsers } from "../../../apis/UserController.js";
import Layout from "../../Navbar/Layout.tsx";
import CreateSensor from "./CreateSensor.js";
import SmallTable from "./SmallTable.js";
import TableFiles from "./TableFiles.js";

export default function SensorTypes() {
  const { t } = useTranslation("translation");
  const [newSensorAdd, setNewSensorAdd] = React.useState("");
  const { register, handleSubmit } = useForm();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [dataLength, setDataLength] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [sensors, setSensors] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [uniqueManufacturers, setUniqueManufacturers] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);

  const properties = [
    { value: "Encoding", label: "ENCODING" },
    { value: "AAAA", label: "YEAR" },
    { value: "JJ", label: "DAY" },
    { value: "HH", label: "HOUR" },
    { value: "MM", label: "MINUTE" },
    { value: "SS", label: "SECOND" },
  ];
  const getLabelForValue = (values) => {
    return values?.map((value) => {
      const property = properties.find(
        (prop) => prop.value?.toLowerCase() === value?.toLowerCase()
      );
      return property ? property.label : "Unknown Label";
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(initialFormData);
  };

  const fetchSensorType = async () => {
    try {
      const responseSensor = await getSensorTypes();
      setUniqueManufacturers(
        Array.from(new Set(responseSensor.map((sensor) => sensor.manufacturer)))
      );
      setDataLength(responseSensor.length);
    } catch (error) {
      console.error("Error fetching sensor types:", error);
    }
  };

  useEffect(() => {
    fetchSensorType();
    console.log("sensors", sensors);
  }, [open, newSensorAdd]);
  const [prevPage, setPrevPage] = useState(0);

  useEffect(() => {
    setPrevPage((prev) => Math.max(prev, page));
  }, [page, open]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const newData = await getSensorTypes(
          "",
          page * rowsPerPage,
          rowsPerPage
        );
        // Create an array of promises for the additional requests
        const additionalRequests = newData.map(async (row) => {
          const firstAdditionalInfo = await getUsers(
            `{"_id":"${row.createdBy}"}`
          );

          return {
            ...row,
            user: `${firstAdditionalInfo[0]?.firstName} ${
              firstAdditionalInfo[0]?.lastName || ""
            }`,
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
  }, [rowsPerPage, page, open, isEditing, newSensorAdd]);

  const [searchText, setSearchText] = useState("");
  const [selectedPropertyValue, setSelectedPropertyValue] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Use the searchText, selectedPropertyValue, and selectedUserNameId values for your search logic
    console.log("Search Text:", searchText);
    console.log("Selected Sensor ID:", selectedPropertyValue);
    console.log("Selected User Name ID:", selectedManufacturer);

    try {
      const queryObject = {};

      if (searchText) {
        queryObject.type = searchText;
      }

      if (selectedPropertyValue !== null) {
        queryObject.properties = selectedPropertyValue;
      }

      if (selectedManufacturer !== null) {
        queryObject.manufacturer = selectedManufacturer;
      }
      const queryString = JSON.stringify(queryObject);
      console.log("query", queryString);
      // Make the API request using Axios with the constructed query object
      const response = await getSensorTypes(queryString);
      setDataLength(response.length);
      const additionalRequests = response.map(async (row) => {
        const firstAdditionalInfo = await getUsers(
          `{"_id":"${row?.createdBy}"}`
        ); // Replace with your actual method

        return {
          ...row,
          user: `${firstAdditionalInfo[0]?.firstName} ${
            firstAdditionalInfo[0]?.lastName || ""
          }`,
        };
      });

      // Wait for all additional requests to complete
      const additionalResults = await Promise.all(additionalRequests);
      console.log("row?.createdBy", additionalResults);
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
    console.log("Form Data on Save:", formData);
    try {
      const res = await updateSensorType(
        sensors[page * rowsPerPage + selectedRow]?._id,
        {
          type: formData.type,
          properties: formData.properties,
          manufacturer: formData.manufacturer,
          // Include any other properties you want to update
        }
      );
      console.log(res);
      // Reset the state and hide the form
      setIsEditing(false);
    } catch (error) {
      // Handle errors as needed
      console.error("Error updating sensor type:", error);
    }
  };

  const deleteSensor = async () => {
    try {
      const response = await deleteSensorType(
        sensors[page * rowsPerPage + selectedRow]?._id
      );

      console.log(response.data);
      setSelectedRow(0);
    } catch (error) {
      console.error("Error deleting sensor type:", error);
    }
  };

  const filedetails = [
    {
      label: "Type",
      value: sensors[page * rowsPerPage + selectedRow]?.type || "Unnamed",
    },
    {
      label: `${t("Sensors.manufacturer")}`,
      value:
        sensors[page * rowsPerPage + selectedRow]?.manufacturer ||
        "Not defined",
    },

    {
      label: `${t("Sensors.is-default")}`,
      value: sensors[page * rowsPerPage + selectedRow]?.isDefault
        ? "True"
        : "False",
    },
    {
      label: `${t("Sensors.author")}`,
      value: sensors[page * rowsPerPage + selectedRow]?.user || "",
    },
    {
      label: `${t("Sensors.properties")}`,
      value: getLabelForValue(
        sensors[page * rowsPerPage + selectedRow]?.properties
      ),
    },
  ];

  const initialFormData = {
    type: sensors[page * rowsPerPage + selectedRow]?.type,
    properties: getLabelForValue(
      sensors[page * rowsPerPage + selectedRow]?.properties
    ),
    manufacturer: sensors[page * rowsPerPage + selectedRow]?.manufacturer,
  };
  const [formData, setFormData] = React.useState(initialFormData);
  useEffect(() => {
    setFormData({
      type: sensors[page * rowsPerPage + selectedRow]?.type,
      properties: getLabelForValue(
        sensors[page * rowsPerPage + selectedRow]?.properties
      ),
      manufacturer: sensors[page * rowsPerPage + selectedRow]?.manufacturer,
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
                    <FormLabel>{t("Sensors.search")}</FormLabel>
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

                <Box gridColumn="span 6">
                  <FormControl size="sm">
                    <FormLabel>{t("Sensors.properties")}</FormLabel>

                    <Autocomplete
                      size="sm"
                      disabled
                      autoHighlight
                      {...register("properties")}
                      options={properties} // Assuming sensorOptions is an array of objects with id and type properties
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value} // Assuming id is the property you want to capture
                      value={
                        properties.find(
                          (option) => option.value === selectedPropertyValue
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        setSelectedPropertyValue(newValue?.id || null)
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
                <Box gridColumn="span 6">
                  <FormControl size="sm">
                    <FormLabel>{t("Sensors.manufacturer")}</FormLabel>
                    <Autocomplete
                      size="sm"
                      autoHighlight
                      {...register("manufacturer")}
                      options={uniqueManufacturers}
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      value={
                        uniqueManufacturers.find(
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
            {sensors[page * rowsPerPage + selectedRow]?.type || "Unnamed"}
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
                      ? // If the value is an array, join its elements into a string
                        // If the value is an array, map through its elements and display each value in line
                        item.value.map((prop, propIndex) => (
                          <Chip key={propIndex} sx={{ m: 0.5 }}>
                            {prop}

                            {/* Add comma if not the last element */}
                          </Chip>
                        ))
                      : // If the value is not an array, display it as is
                        item.value}
                  </div>
                </React.Fragment>
              ))}
            </Box>
            <Divider />
            <Box sx={{ py: 2, px: 1 }}>
              {isEditing ? (
                // Display the form when editing
                <form style={{ padding: 0 }}>
                  <FormControl sx={{ paddingBottom: 1.5, width: "90%" }}>
                    <FormLabel>Type</FormLabel>
                    <Input
                      value={formData.type}
                      onChange={handleChange}
                      label="Type"
                      name="type"
                      variant="outlined"
                      size="md"
                    />
                  </FormControl>
                  <FormControl sx={{ paddingBottom: 1.5, width: "90%" }}>
                    <FormLabel>
                      {t("Contribute.add-sensor-properties")}
                    </FormLabel>
                    <Autocomplete
                      multiple
                      size="sm"
                      id="properties"
                      options={properties}
                      value={formData.properties}
                      onChange={(_, newValue) =>
                        handleChange({
                          target: { name: "properties", value: newValue },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ paddingBottom: 2, width: "90%" }}>
                    <FormLabel>{t("Contribute.add-sensor-manu")}</FormLabel>
                    <Input
                      size="md"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                    />
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
                            {sensors[page * rowsPerPage + selectedRow]?.type}
                          </strong>{" "}
                          ?
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="solid"
                          color="danger"
                          onClick={() => {
                            deleteSensor();
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
              )}
            </Box>
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}
