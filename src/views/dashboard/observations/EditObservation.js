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
import * as React from "react";
import { useTranslation } from "react-i18next";
import { createSensorType } from "../../../apis/SensorTypeController";
import CountrySelector from "../settings/CountrySelector";
export default function EditObservation({ setNewSensorAdd }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    type: "",
    properties: [],
    manufacturer: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valuesList = formData.properties.map((item) => item.value);
    formData.properties = valuesList;
    const response = await createSensorType(formData);

    setNewSensorAdd(response);
    try {
      // Assuming you have an API endpoint for adding a new sensor
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

  const handleSaveClick = async () => {
    console.log("Form Data on Save:", formData);
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
    // // Reset the state and hide the form
    // setIsEditing(false);
    // setFormData(initialFormData);
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
        {t("Edit")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{t("Update observation")}</DialogTitle>

          <form
            style={{ padding: 0, display: "initial" }}
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>{t("Contribute.cave-id")}</FormLabel>
                <Input
                  autoFocus
                  name="caveId"
                  value={formData.caveId}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("Sensor Type")}</FormLabel>

                <Autocomplete
                  sx={{
                    height: "41.6px",
                    minWidth: "25rem",
                    marginBottom: 2,
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
              <CountrySelector />
              <FormControl>
                <FormLabel>{t("Contribute.begin-date")}</FormLabel>
                <Input
                  name="beginDate"
                  type="datetime-local"
                  value={formData.beginDate}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("Contribute.end-date")}</FormLabel>
                <Input
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </FormControl>
              <ButtonGroup
                spacing="0.5rem"
                sx={{ alignSelf: "center" }}
                aria-label="spacing button group"
              >
                <Button
                  onClick={handleSaveClick}
                  color="primary"
                  variant="soft"
                >
                  Update
                </Button>

                <Button
                  onClick={handleCancelClick}
                  color="warning"
                  variant="soft"
                >
                  Cancel
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
