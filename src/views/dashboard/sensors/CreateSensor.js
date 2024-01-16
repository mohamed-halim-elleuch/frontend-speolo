import Add from "@mui/icons-material/Add";
import { Autocomplete } from "@mui/joy";
import Button from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import * as React from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import {
  createSensorType,
  getSensorTypes,
} from "../../../apis/SensorTypeController";
import { createSensor } from "../../../apis/SensorController";

export default function CreateSensor({ setNewSensorAdd }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState(null);
  const [sensorTypeValue, setSensorTypeValue] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    serialNo: "",
    observes: "",
    sensorTypeId: "",
  });
  React.useEffect(() => {
    const fetchSensorType = async () => {
      try {
        const responseSensorType = await getSensorTypes();
        setOptions(
          responseSensorType.map((sensor) => ({
            type: sensor.type,
            id: sensor._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching sensor types:", error);
        // Handle errors as needed
      }
    };

    fetchSensorType();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await createSensor(formData);

    setNewSensorAdd(response);
    try {
      // Assuming you have an API endpoint for adding a new sensor
    } catch (error) {
      console.error("Error adding sensor:", error.message);
    }

    setOpen(false);
  };
  const handleInnerFormSubmit = (event) => {
    // Prevent the event from propagating to the outer form
    event.stopPropagation();
    handleSubmit(event);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="plain"
        color="primary"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        {t("Sensors.create")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ width: "27vw" }}>
          <DialogTitle>Create new sensor</DialogTitle>

          <form
            style={{ padding: 0, display: "initial" }}
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>serialNo</FormLabel>
                <Input
                  autoFocus
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Observes</FormLabel>
                <Input
                  autoFocus
                  name="observes"
                  value={formData.observes}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Sensor Type</FormLabel>
                <Box display="flex" sx={{ alignItems: "center" }}>
                  <Autocomplete
                    name="sensorTypeId"
                    value={sensorTypeValue}
                    autoHighlight
                    getOptionLabel={(option) => option?.type}
                    getOptionValue={(option) => option?.id}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        sensorTypeId: newValue?.id,
                      });
                      setSensorTypeValue(newValue);
                    }}
                    options={options}
                    sx={{ marginBottom: 2, width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Sensor Type" />
                    )}
                  />
                </Box>
              </FormControl>
              <Button type="submit" onClick={handleInnerFormSubmit}>
                {t("Contribute.submit")}
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
