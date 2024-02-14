import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";

import { Button } from "@mui/joy";
import { Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createObservation } from "../../apis/CaveObservationController";
import { getSensorTypes } from "../../apis/SensorTypeController";
import ShowMessage from "../common/ShowMessage";
import BasicModalDialog from "./DialogButton";
import { getSensors } from "../../apis/SensorController";
import { fetchUserInfo } from "../../apis/UserController";

export default function Contribute() {
  const { t } = useTranslation("translation");
  const [options, setOptions] = React.useState([]);
  const [beginvalue, setBeginValue] = React.useState(null);
  const [endvalue, setEndValue] = React.useState(null);
  const [value, setValueType] = React.useState(null);
  const [sensorValue, setSensorValue] = React.useState("");
  const [showMessage, setShowMessage] = React.useState(false);
  const [newSensorAdd, setNewSensorAdd] = React.useState("");
  const [userRole, SetUserRole] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetchUserInfo();
        setUserId(res._id);
        SetUserRole(res.role);
      } catch (error) {}
    };

    fetchUserRole();
  }, []);

  React.useEffect(() => {
    const fetchSensorType = async () => {
      try {
        const responseSensor = await getSensors();

        responseSensor.data = responseSensor.data.filter(
          (row) =>
            (userRole === "user" && userId === row.createdBy) ||
            userRole === "admin"
        );
        console.log("sensors", responseSensor.data);
        setOptions(responseSensor.data);
      } catch (error) {
        console.error("Error fetching sensor types:", error);
        // Handle errors as needed
      }
    };

    fetchSensorType();
  }, [newSensorAdd]);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Get relevant form data
    const { caveId, beginDate, endDate, sensorId } = getValues();

    //const renamedFile = new File([file], fileName, { type: file?.type });
    setValue("fileName", file.name);
    setValue("file", file);
    console.log("file", file);
  };

  const onSubmit = async (data) => {
    setShowMessage(false);
    try {
      const response = await createObservation(data);

      setValue("filePath", response.filePath);
      setShowMessage(true);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <Box style={{ height: "92vh", backgroundColor: "#eee" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            padding: 5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "darkgray",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)", // Add shadow
            margin: "auto",
            marginTop: 3,
            maxWidth: "90%", // Set a maximum width if needed
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {t("Contribute.add-cont")}
          </Typography>
          {showMessage ? (
            <ShowMessage
              openvalue={showMessage}
              message="Observation added"
              status="success"
            />
          ) : (
            <></>
          )}

          <TextField
            {...register("caveId")}
            name="caveId"
            label={t("Contribute.cave-id")}
            id="caveId"
            sx={{ marginBottom: 2, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">e.g. 78714</InputAdornment>
              ),
            }}
          />

          <Autocomplete
            {...register("timeZone")}
            id="country-select-demo"
            sx={{ marginBottom: 2, width: "100%" }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                {option.label} ({option.code})
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                name="timeZone"
                label={t("Contribute.country")}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
          <Box display="flex" sx={{ alignItems: "center" }}>
            <Autocomplete
              {...register("sensorId")}
              value={value}
              autoHighlight
              onChange={(event, newValue) => {
                setValue("sensorId", newValue?._id);
                setValueType(newValue);
              }}
              inputValue={sensorValue}
              onInputChange={(event, newInputValue) => {
                setSensorValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={options}
              isOptionEqualToValue={(option, value) => option?.name === value}
              getOptionLabel={(option) => option?.name || option?.serialNo}
              sx={{ marginBottom: 2, width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label={t("Contribute.sensor")} />
              )}
            />
            <BasicModalDialog setNewSensorAdd={setNewSensorAdd} />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              {...register("beginDate")}
              name="beginDate"
              sx={{ marginBottom: 2, width: "100%" }}
              label={t("Contribute.begin-date")}
              value={beginvalue}
              onChange={(newValue) => setValue("beginDate", newValue)}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              {...register("endDate")}
              name="endDate"
              sx={{ marginBottom: 2, width: "100%" }}
              label={t("Contribute.end-date")}
              value={endvalue}
              onChange={(newValue) => setValue("endDate", newValue)}
            />
          </LocalizationProvider>

          <Box display="flex" marginBottom={2} sx={{ alignItems: "center" }}>
            <Button
              component="label"
              variant="soft"
              startIcon={<CloudUploadIcon />}
              sx={{ width: "41%", height: "39px" }}
            >
              {t("Contribute.upload")}
              <VisuallyHiddenInput
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </Button>

            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="dense"
                  value={getValues("file")?.name || ""}
                  InputProps={{ readOnly: true, flex: 1, marginLeft: 2 }}
                  size="small"
                  sx={{ width: "60%", marginTop: 0.5 }}
                />
              )}
            />
          </Box>

          <Button
            variant="solid"
            color="primary"
            type="submit"
            sx={{ width: "50%", marginTop: 2 }}
          >
            {t("Contribute.submit")}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries = [
  { code: "AD", label: "Andorra" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "AF", label: "Afghanistan" },
  { code: "AG", label: "Antigua and Barbuda" },
  { code: "AI", label: "Anguilla" },
  { code: "AL", label: "Albania" },
  { code: "AM", label: "Armenia" },
  { code: "AO", label: "Angola" },
  { code: "AQ", label: "Antarctica" },
  { code: "AR", label: "Argentina" },
  { code: "AS", label: "American Samoa" },
  { code: "AT", label: "Austria" },
  { code: "AU", label: "Australia", suggested: true },
  { code: "AW", label: "Aruba" },
  { code: "AX", label: "Alland Islands" },
  { code: "AZ", label: "Azerbaijan" },
  { code: "BA", label: "Bosnia and Herzegovina" },
  { code: "BB", label: "Barbados" },
  { code: "BD", label: "Bangladesh" },
  { code: "BE", label: "Belgium" },
  { code: "BF", label: "Burkina Faso" },
  { code: "BG", label: "Bulgaria" },
  { code: "BH", label: "Bahrain" },
  { code: "BI", label: "Burundi" },
  { code: "BJ", label: "Benin" },
  { code: "BL", label: "Saint Barthelemy" },
  { code: "BM", label: "Bermuda" },
  { code: "BN", label: "Brunei Darussalam" },
  { code: "BO", label: "Bolivia" },
  { code: "BR", label: "Brazil" },
  { code: "BS", label: "Bahamas" },
  { code: "BT", label: "Bhutan" },
  { code: "BV", label: "Bouvet Island" },
  { code: "BW", label: "Botswana" },
  { code: "BY", label: "Belarus" },
  { code: "BZ", label: "Belize" },
  { code: "CA", label: "Canada", suggested: true },
  { code: "CC", label: "Cocos (Keeling) Islands" },
  { code: "CD", label: "Congo, Democratic Republic of the" },
  { code: "CF", label: "Central African Republic" },
  { code: "CG", label: "Congo, Republic of the" },
  { code: "CH", label: "Switzerland" },
  { code: "CI", label: "Cote d'Ivoire" },
  { code: "CK", label: "Cook Islands" },
  { code: "CL", label: "Chile" },
  { code: "CM", label: "Cameroon" },
  { code: "CN", label: "China" },
  { code: "CO", label: "Colombia" },
  { code: "CR", label: "Costa Rica" },
  { code: "CU", label: "Cuba" },
  { code: "CV", label: "Cape Verde" },
  { code: "CW", label: "Curacao" },
  { code: "CX", label: "Christmas Island" },
  { code: "CY", label: "Cyprus" },
  { code: "CZ", label: "Czech Republic" },
  { code: "DE", label: "Germany", suggested: true },
  { code: "DJ", label: "Djibouti" },
  { code: "DK", label: "Denmark" },
  { code: "DM", label: "Dominica" },
  { code: "DO", label: "Dominican Republic" },
  { code: "DZ", label: "Algeria" },
  { code: "EC", label: "Ecuador" },
  { code: "EE", label: "Estonia" },
  { code: "EG", label: "Egypt" },
  { code: "EH", label: "Western Sahara" },
  { code: "ER", label: "Eritrea" },
  { code: "ES", label: "Spain" },
  { code: "ET", label: "Ethiopia" },
  { code: "FI", label: "Finland" },
  { code: "FJ", label: "Fiji" },
  { code: "FK", label: "Falkland Islands (Malvinas)" },
  { code: "FM", label: "Micronesia, Federated States of" },
  { code: "FO", label: "Faroe Islands" },
  { code: "FR", label: "France", suggested: true },
  { code: "GA", label: "Gabon" },
  { code: "GB", label: "United Kingdom" },
  { code: "GD", label: "Grenada" },
  { code: "GE", label: "Georgia" },
  { code: "GF", label: "French Guiana" },
  { code: "GG", label: "Guernsey" },
  { code: "GH", label: "Ghana" },
  { code: "GI", label: "Gibraltar" },
  { code: "GL", label: "Greenland" },
  { code: "GM", label: "Gambia" },
  { code: "GN", label: "Guinea" },
  { code: "GP", label: "Guadeloupe" },
  { code: "GQ", label: "Equatorial Guinea" },
  { code: "GR", label: "Greece" },
  { code: "GS", label: "South Georgia and the South Sandwich Islands" },
  { code: "GT", label: "Guatemala" },
  { code: "GU", label: "Guam" },
  { code: "GW", label: "Guinea-Bissau" },
  { code: "GY", label: "Guyana" },
  { code: "HK", label: "Hong Kong" },
  { code: "HM", label: "Heard Island and McDonald Islands" },
  { code: "HN", label: "Honduras" },
  { code: "HR", label: "Croatia" },
  { code: "HT", label: "Haiti" },
  { code: "HU", label: "Hungary" },
  { code: "ID", label: "Indonesia" },
  { code: "IE", label: "Ireland" },
  { code: "IL", label: "Israel" },
  { code: "IM", label: "Isle of Man" },
  { code: "IN", label: "India" },
  { code: "IO", label: "British Indian Ocean Territory" },
  { code: "IQ", label: "Iraq" },
  { code: "IR", label: "Iran, Islamic Republic of" },
  { code: "IS", label: "Iceland" },
  { code: "IT", label: "Italy" },
  { code: "JE", label: "Jersey" },
  { code: "JM", label: "Jamaica" },
  { code: "JO", label: "Jordan" },
  { code: "JP", label: "Japan", suggested: true },
  { code: "KE", label: "Kenya" },
  { code: "KG", label: "Kyrgyzstan" },
  { code: "KH", label: "Cambodia" },
  { code: "KI", label: "Kiribati" },
  { code: "KM", label: "Comoros" },
  { code: "KN", label: "Saint Kitts and Nevis" },
  { code: "KP", label: "Korea, Democratic People's Republic of" },
  { code: "KR", label: "Korea, Republic of" },
  { code: "KW", label: "Kuwait" },
  { code: "KY", label: "Cayman Islands" },
  { code: "KZ", label: "Kazakhstan" },
  { code: "LA", label: "Lao People's Democratic Republic" },
  { code: "LB", label: "Lebanon" },
  { code: "LC", label: "Saint Lucia" },
  { code: "LI", label: "Liechtenstein" },
  { code: "LK", label: "Sri Lanka" },
  { code: "LR", label: "Liberia" },
  { code: "LS", label: "Lesotho" },
  { code: "LT", label: "Lithuania" },
  { code: "LU", label: "Luxembourg" },
  { code: "LV", label: "Latvia" },
  { code: "LY", label: "Libya" },
  { code: "MA", label: "Morocco" },
  { code: "MC", label: "Monaco" },
  { code: "MD", label: "Moldova, Republic of" },
  { code: "ME", label: "Montenegro" },
  { code: "MF", label: "Saint Martin (French part)" },
  { code: "MG", label: "Madagascar" },
  { code: "MH", label: "Marshall Islands" },
  { code: "MK", label: "Macedonia, the Former Yugoslav Republic of" },
  { code: "ML", label: "Mali" },
  { code: "MM", label: "Myanmar" },
  { code: "MN", label: "Mongolia" },
  { code: "MO", label: "Macao" },
  { code: "MP", label: "Northern Mariana Islands" },
  { code: "MQ", label: "Martinique" },
  { code: "MR", label: "Mauritania" },
  { code: "MS", label: "Montserrat" },
  { code: "MT", label: "Malta" },
  { code: "MU", label: "Mauritius" },
  { code: "MV", label: "Maldives" },
  { code: "MW", label: "Malawi" },
  { code: "MX", label: "Mexico" },
  { code: "MY", label: "Malaysia" },
  { code: "MZ", label: "Mozambique" },
  { code: "NA", label: "Namibia" },
  { code: "NC", label: "New Caledonia" },
  { code: "NE", label: "Niger" },
  { code: "NF", label: "Norfolk Island" },
  { code: "NG", label: "Nigeria" },
  { code: "NI", label: "Nicaragua" },
  { code: "NL", label: "Netherlands" },
  { code: "NO", label: "Norway" },
  { code: "NP", label: "Nepal" },
  { code: "NR", label: "Nauru" },
  { code: "NU", label: "Niue" },
  { code: "NZ", label: "New Zealand" },
  { code: "OM", label: "Oman" },
  { code: "PA", label: "Panama" },
  { code: "PE", label: "Peru" },
  { code: "PF", label: "French Polynesia" },
  { code: "PG", label: "Papua New Guinea" },
  { code: "PH", label: "Philippines" },
  { code: "PK", label: "Pakistan" },
  { code: "PL", label: "Poland" },
  { code: "PM", label: "Saint Pierre and Miquelon" },
  { code: "PN", label: "Pitcairn" },
  { code: "PR", label: "Puerto Rico" },
  { code: "PS", label: "Palestine, State of" },
  { code: "PT", label: "Portugal" },
  { code: "PW", label: "Palau" },
  { code: "PY", label: "Paraguay" },
  { code: "QA", label: "Qatar" },
  { code: "RE", label: "Reunion" },
  { code: "RO", label: "Romania" },
  { code: "RS", label: "Serbia" },
  { code: "RU", label: "Russian Federation" },
  { code: "RW", label: "Rwanda" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "SB", label: "Solomon Islands" },
  { code: "SC", label: "Seychelles" },
  { code: "SD", label: "Sudan" },
  { code: "SE", label: "Sweden" },
  { code: "SG", label: "Singapore" },
  { code: "SH", label: "Saint Helena" },
  { code: "SI", label: "Slovenia" },
  { code: "SJ", label: "Svalbard and Jan Mayen" },
  { code: "SK", label: "Slovakia" },
  { code: "SL", label: "Sierra Leone" },
  { code: "SM", label: "San Marino" },
  { code: "SN", label: "Senegal" },
  { code: "SO", label: "Somalia" },
  { code: "SR", label: "Suriname" },
  { code: "SS", label: "South Sudan" },
  { code: "ST", label: "Sao Tome and Principe" },
  { code: "SV", label: "El Salvador" },
  { code: "SX", label: "Sint Maarten (Dutch part)" },
  { code: "SY", label: "Syrian Arab Republic" },
  { code: "SZ", label: "Swaziland" },
  { code: "TC", label: "Turks and Caicos Islands" },
  { code: "TD", label: "Chad" },
  { code: "TF", label: "French Southern Territories" },
  { code: "TG", label: "Togo" },
  { code: "TH", label: "Thailand" },
  { code: "TJ", label: "Tajikistan" },
  { code: "TK", label: "Tokelau" },
  { code: "TL", label: "Timor-Leste" },
  { code: "TM", label: "Turkmenistan" },
  { code: "TN", label: "Tunisia" },
  { code: "TO", label: "Tonga" },
  { code: "TR", label: "Turkey" },
  { code: "TT", label: "Trinidad and Tobago" },
  { code: "TV", label: "Tuvalu" },
  { code: "TW", label: "Taiwan" },
  { code: "TZ", label: "United Republic of Tanzania" },
  { code: "UA", label: "Ukraine" },
  { code: "UG", label: "Uganda" },
  { code: "US", label: "United States", suggested: true },
  { code: "UY", label: "Uruguay" },
  { code: "UZ", label: "Uzbekistan" },
  { code: "VA", label: "Holy See (Vatican City State)" },
  { code: "VC", label: "Saint Vincent and the Grenadines" },
  { code: "VE", label: "Venezuela" },
  { code: "VG", label: "British Virgin Islands" },
  { code: "VI", label: "US Virgin Islands" },
  { code: "VN", label: "Vietnam" },
  { code: "VU", label: "Vanuatu" },
  { code: "WF", label: "Wallis and Futuna" },
  { code: "WS", label: "Samoa" },
  { code: "XK", label: "Kosovo" },
  { code: "YE", label: "Yemen" },
  { code: "YT", label: "Mayotte" },
  { code: "ZA", label: "South Africa" },
  { code: "ZM", label: "Zambia" },
  { code: "ZW", label: "Zimbabwe" },
];
