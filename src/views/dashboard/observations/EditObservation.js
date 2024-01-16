import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Autocomplete, ButtonGroup } from "@mui/joy";
import Button from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createSensorType } from "../../../apis/SensorTypeController";
import CountrySelector from "../settings/CountrySelector";
import { TextField } from "@mui/material";
import { getSensors } from "../../../apis/SensorController";

export default function EditObservation({ obsvalue, setNewSensorAdd }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(obsvalue);
  const [sensors, setSensors] = React.useState(null);
  useEffect(() => {
    console.log(obsvalue);
    setFormData((prevFormData) => ({
      caveId: obsvalue?.caveId,
      sensorId: obsvalue?.sensorId,
      timeZone: obsvalue?.timeZone,
      beginDate: obsvalue?.beginDate?.slice(0, -5),
      endDate: obsvalue?.endDate?.slice(0, -5),
    }));
  }, [obsvalue]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit", formData);
    try {
      //const res = await update(
      //     sensors[page * rowsPerPage + selectedRow]?._id,
      //     {
      //       type: formData.type,
      //       properties: formData.properties,
      //       manufacturer: formData.manufacturer,
      //       // Include any other properties you want to update
      //     }
      //   );
      //   console.log(res);
    } catch (error) {
      console.error("Error adding sensor:", error.message);
    }

    setOpen(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchSensors = async () => {
    try {
      const responseSensor = await getSensors();
      setSensors(
        responseSensor.data.map((sensor) => ({
          name: sensor?.name,
          id: sensor._id,
        }))
      );
    } catch (error) {}
  };
  useEffect(() => {
    fetchSensors();
  }, []);

  const handleSaveClick = async () => {
    console.log("handleSaveClick", formData);
    // try {
    //   const res = await updateSensorType(
    //     sensors[page * rowsPerPage + selectedRow]?._id,
    //     {
    //       type: formData.type,
    //       properties: formData.properties,
    //       manufacturer: formData.manufacturer,
    //       // Include any other properties you want to update
    //     }
    //   );
    //   console.log(res);
    //   // Reset the state and hide the form
    //   setIsEditing(false);
    // } catch (error) {
    //   // Handle errors as needed
    //   console.error("Error updating sensor type:", error);
    // }
  };
  const handleCancelClick = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="plain"
        endDecorator={<EditRoundedIcon />}
        onClick={() => setOpen(true)}
      >
        {t("Sensors.edit")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ backgroundColor: "white" }}>
          <DialogTitle>{t("Obs.titleUpdate")}</DialogTitle>

          <form
            style={{ padding: 0, display: "initial", backgroundColor: "white" }}
            onSubmit={handleSubmit}
          >
            <Stack spacing={2} color="white">
              <FormControl>
                <FormLabel>{t("Contribute.cave-id")}</FormLabel>
                <Input
                  readOnly
                  autoFocus
                  name="caveId"
                  value={formData?.caveId}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sensor</FormLabel>
                <Autocomplete
                  size="md"
                  sx={{
                    minWidth: "25rem",
                    marginBottom: 2,
                  }}
                  autoHighlight
                  value={sensors?.find(
                    (option) => option.id === formData?.sensorId
                  )}
                  options={sensors}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      sensorId: newValue?.id,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Sensor"}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </FormControl>
              <CountrySelector initialValue={formData?.timeZone} />
              <FormControl>
                <FormLabel>{t("Contribute.begin-date")}</FormLabel>
                <Input
                  name="beginDate"
                  type="datetime-local"
                  value={formData?.beginDate}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("Contribute.end-date")}</FormLabel>
                <Input
                  name="endDate"
                  type="datetime-local"
                  value={formData?.endDate}
                  onChange={handleChange}
                />
              </FormControl>
              <ButtonGroup
                spacing="0.5rem"
                sx={{ alignSelf: "center" }}
                aria-label="spacing button group"
              >
                <Button type="submit" color="primary" variant="soft">
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
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

const properties = [
  { value: "encoding", label: "ENCODING" },
  { value: "AAAA", label: "YEAR" },
  { value: "JJ", label: "DAY" },
  { value: "HH", label: "HOUR" },
  { value: "MM", label: "MINUTE" },
  { value: "SS", label: "SECOND" },
];
