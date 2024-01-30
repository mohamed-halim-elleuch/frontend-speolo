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
import { useTranslation } from "react-i18next";
import { createSensorType } from "../../../apis/SensorTypeController";
import ShowMessage from "../../common/ShowMessage";
import { useEffect } from "react";

export default function CreateSensor({ setNewSensorAdd }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = React.useState(false);
  const [updateMessage, setUpdateMessage] = React.useState(null);
  const [formData, setFormData] = React.useState({
    type: "",
    properties: [],
    manufacturer: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valuesList = formData.properties.map((item) => item.value);
    formData.properties = valuesList;
    try {
      const response = await createSensorType(formData);
      setNewSensorAdd(response);
    } catch (error) {
      setUpdateMessage({
        open: true,
        message: error.message,
        status: "error",
      });
    }
    setFormData({ type: "", properties: [], manufacturer: "" });
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
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  return (
    <React.Fragment>
      {updateMessage && (
        <ShowMessage
          openvalue={updateMessage.open}
          message={updateMessage.message}
          status={updateMessage.status}
        />
      )}
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
        <ModalDialog>
          <DialogTitle>{t("Contribute.add-sensor-title")}</DialogTitle>

          <form
            style={{ padding: 0, display: "initial" }}
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input
                  autoFocus
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("Contribute.add-sensor-properties")}</FormLabel>

                <Autocomplete
                  sx={{
                    height: "41.6px",
                    minWidth: "25rem",
                  }}
                  multiple
                  id="properties"
                  options={properties}
                  value={formData.properties}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      properties: newValue,
                    });
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("Contribute.add-sensor-manu")}</FormLabel>
                <Input
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                />
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

const properties = [
  { value: "temperature", label: "TEMPERATURE" },
  { value: "pression", label: "PRESSION" },
  { value: "conductivity_meters", label: "CONDUCTIVITY METERS" },
];
