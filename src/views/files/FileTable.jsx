/* eslint-disable jsx-a11y/anchor-is-valid */
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import React, { useEffect, useState } from "react";
import CloseRounded from '@mui/icons-material/CloseRounded';
// icons
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Autocomplete,  TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getSensors } from "../../apis/SensorController";
import { getUsers } from "../../apis/UserController";
import { getSensorTypes } from "../../apis/SensorTypeController";
import { MenuItem, Option, Select } from "@mui/joy";


export default function FileTable({ rows }) {
  const { t } = useTranslation("translation");
  const [filteredRows,setFilteredRows] = useState(rows)
  const action = React.useRef(null);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const rowsPerPage = 10; // Set the desired number of rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorTypesOptions, setSensorTypesOptions] = useState([]);
  const [sensorsOptions, setSensorsOptions] = useState([]);
  const [userNameOptions, setUserNameOptions] = useState([]);
  const [selectedSensorId, setSelectedSensorId] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState("");
  const [selectedUserNameId, setSelectedUserNameId] = useState("");
  const [selectedSearchTerm,setSelectedSearchTerm] = useState("");

  const fetchUserName = async () => {
    try {
      const responseUserNames = await getUsers(); // Assuming there's a function to fetch user names
      const filteredUserNames = responseUserNames.filter(user =>
        rows.some(row => row.createdBy === user._id)
      );
      setUserNameOptions(
        filteredUserNames.map((user) => ({
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
      const filteredSensors = responseSensor.filter(sensor =>
        rows.some(row => row.sensor_type === sensor.type)
      );
      setSensorTypesOptions(
        filteredSensors.map((sensor) => ({
          type: sensor?.type,
          id: sensor._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching sensor types:", error);
      // Handle errors as needed
    }
  };

  const fetchSensors = async () => {
    try {
      const responseSensor = await getSensors();
      const filteredSensors = responseSensor.data.filter(sensor =>
        rows.some(row => row.sensorId === sensor._id)
      );
      setSensorsOptions(
        filteredSensors.map((sensor) => ({
          name: sensor?.name || sensor.serialNo,
          id: sensor._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching sensors:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    fetchSensors();
    fetchSensorType();
    fetchUserName();
  }, [rows]);
  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const downloadFile = (row) => {
    window.open(row.filePath, "_blank");
  };


  // Define a function to send the request with the selected filters
  const sendFilteredRequest = () => {
      const filteredRowsAux = rows.filter(row => {
    // Check if the row matches the selected values
    const matchesSensorId = !selectedSensorId || row.sensorId === selectedSensorId;
    const matchesSensorType = !selectedSensorType || row.sensor_type === selectedSensorType;
    const matchesUserNameId = !selectedUserNameId || row.createdBy === selectedUserNameId;
    const matchesFileName = !selectedSearchTerm || row.fileName.toLowerCase().includes(selectedSearchTerm.toLowerCase());

    // Return true if all conditions are met
    return matchesSensorId && matchesSensorType && matchesUserNameId && matchesFileName;
  });
setFilteredRows(filteredRowsAux);

  }

  // useEffect hook to send the request whenever any of the filter values change
  useEffect(() => {
    sendFilteredRequest();
  }, [selectedSensorId, selectedSensorType, selectedUserNameId,selectedSearchTerm]);

  const renderFilters = () => <React.Fragment></React.Fragment>;

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder={t("Obs.search")}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: {
            xs: "none",
            sm: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>{t("Obs.serach-label")}</FormLabel>
          <Input
            size="sm"
            placeholder={t("Obs.search")}
            startDecorator={<SearchIcon />}
            onChange={(e) => setSelectedSearchTerm(e.target.value)}
            value={selectedSearchTerm}
          />
        </FormControl>
          <FormControl size="sm">
          <FormLabel>{t("Contribute.sensor")}</FormLabel>
           <Select
            size="sm"
            action={action}
            value={selectedSensorId}
            onChange={(e,newValue) => setSelectedSensorId(newValue)}
            sx={{ width: '100%',height:"38.6px" }}
            {...(selectedSensorId && {
        // display the button and remove select indicator
        // when user has selected a value
        endDecorator: (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              // don't open the popup when clicking on this button
              event.stopPropagation();
            }}
            onClick={() => {
              setSelectedSensorId(null);
              action.current?.focusVisible();
            }}
          >
            <CloseRounded />
          </IconButton>
        ),
        indicator: null,
      })}

          >

            {sensorsOptions.map((sensor) => (
              <Option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </Option>
            ))}
          </Select>
        </FormControl>
        <FormControl size="sm">
          <FormLabel>{t("Obs.sensor")}</FormLabel>
           <Select
            size="sm"
            action={action}
            value={selectedSensorType}
           onChange={(e,newValue) => setSelectedSensorType(newValue)}
            sx={{ width: '100%',height:"38.6px" }}
            {...(selectedSensorType && {
        // display the button and remove select indicator
        // when user has selected a value
        endDecorator: (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              // don't open the popup when clicking on this button
              event.stopPropagation();
            }}
            onClick={() => {
              setSelectedSensorType(null);
              action.current?.focusVisible();
            }}
          >
            <CloseRounded />
          </IconButton>
        ),
        indicator: null,
      })}
          >

            {sensorTypesOptions.map((sensor) => (
              <Option key={sensor.id} value={sensor.type}>
                {sensor?.type}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl size="sm">
          <FormLabel>{t("Obs.author")}</FormLabel>
        <Select
        size="sm"
        action={action}
        value={selectedUserNameId}
        onChange={(event, newValue) => setSelectedUserNameId(newValue)}
        sx={{ width: '100%',height:"38.6px" }}
        {...(selectedUserNameId && {
        // display the button and remove select indicator
        // when user has selected a value
        endDecorator: (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              // don't open the popup when clicking on this button
              event.stopPropagation();
            }}
            onClick={() => {
              setSelectedUserNameId(null);
              action.current?.focusVisible();
            }}
          >
            <CloseRounded />
          </IconButton>
        ),
        indicator: null,
      })}
      >

        {userNameOptions.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>
        </FormControl>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
          "&::-webkit-scrollbar": {
            width: "12px", // Set the width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", // Set the color of the thumb
            borderRadius: "8px",
            backgroundClip: "content-box",
            border: "3px solid transparent",
          },

          "&::-webkit-scrollbar-thumb:hover": {
            background: "#7A90A4",
            backgroundClip: "content-box",
            border: "3px solid transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Set the color of the track
            borderRadius: "10px",
            // Round the corners of the track
          },
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 12px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== filteredRows.length
                  }
                  checked={selected.length === filteredRows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredRows.map((row) => row.id) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === filteredRows.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: "25%", padding: "12px 6px" }}>
                {t("Obs.table.file-name")}
              </th>
              <th style={{ width: "12%", padding: "12px 6px" }}>{t("Contribute.sensor")}</th>
              <th style={{ width: "12%", padding: "12px 6px" }}>
                {t("Obs.table.sensor")}
              </th>

              <th style={{ width: "14%", padding: "12px 6px" }}>
                {t("Obs.table.begin-date")}
              </th>
              <th style={{ width: "14%", padding: "12px 6px" }}>
                {t("Obs.table.end-date")}
              </th>
              <th style={{ width: "17%", padding: "12px 6px" }}>
                {t("Obs.table.author")}
              </th>
              <th style={{ width: "4%", padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.slice(startIndex, endIndex).length != 0 ? (
              filteredRows.slice(startIndex, endIndex).map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? "primary" : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id)
                            : ids.filter((itemId) => itemId !== row.id)
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Typography level="body-xs">{row?.fileName}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {row?.isObservedBy?.name || row?.isObservedBy?.serialNo}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.sensor_type}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.beginDate}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.endDate}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar size="sm">{row?.customer?.initial}</Avatar>
                      <div>
                        <Typography level="body-xs">
                          {row?.customer?.name}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link
                        level="body-xs"
                        component="button"
                        onClick={() => downloadFile(row)}
                      >
                        <IconButton color="primary" aria-label="download">
                          <FileDownloadIcon />
                        </IconButton>
                      </Link>
                    </Box>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>{t("Obs.loading")}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          {t("Obs.table.previous")}
        </Button>

        <Box sx={{ flex: 1 }} />
        {Array.from({ length: totalPages }, (_, index) => (
          <IconButton
            key={index + 1}
            size="sm"
            variant={currentPage === index + 1 ? "outlined" : "plain"}
            color="neutral"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {t("Obs.table.next")}
        </Button>
      </Box>
    </React.Fragment>
  );
}
