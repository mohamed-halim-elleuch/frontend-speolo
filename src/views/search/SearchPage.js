import { Button, Divider, Grid, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCaveDataByGeolocation,
  getCaveById,
  searchCaves,
  searchCavesCountry,
} from "../../apis/CaveController";

const columns = [
  { id: "name", label: "Name", minWidth: 210 },
  { id: "id", label: "ID", minWidth: 80 },
  {
    id: "depth",
    label: "Depth",
    minWidth: 120,
    align: "center",
  },
  {
    id: "length",
    label: "Length",
    minWidth: 120,
    align: "center",
  },
  {
    id: "latitude",
    label: "Latitude",
    minWidth: 150,
    align: "center",
  },
  {
    id: "longitude",
    label: "Longitude",
    minWidth: 150,
    align: "center",
  },
  {
    id: "county",
    label: "County",
    minWidth: 150,
    align: "center",
  },
  {
    id: "country",
    label: "Country Code",
    minWidth: 150,
    align: "center",
  },
  {
    id: "cave_obs",
    label: "Observations",
    minWidth: 150,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];

export default function SearchPage() {
  const { t } = useTranslation("translation");
  const { ids } = useParams();
  const [error, setError] = React.useState("");
  const height = window.innerHeight;
  React.useEffect(() => {
    const getSelectedCaves = async (ids) => {
      // Check if ids is a non-empty string
      if (typeof ids === "string" && ids.trim() !== "") {
        try {
          // Split the string into an array of IDs
          const idArray = ids.split(",");
          const caveDataArray = await fetchCaveDataByGeolocation(
            idArray[0],
            idArray[1],
            idArray[2],
            idArray[3]
          );

          const cityDataArray = caveDataArray.map((caveData) => ({
            ...caveData,
            county: caveData.city,
          }));
          // Set the rows with the array of cave data
          setRows(cityDataArray);
        } catch (error) {
          console.error("Error fetching cave data:", error);
          setError(error?.response?.data?.message);
        }
      }
    };

    getSelectedCaves(ids);
  }, [ids]);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onSubmit = async (data) => {
    try {
      if (data.caveID === "" && data.countryName !== "") {
        const response = await searchCavesCountry(
          data.caveName,
          data.countryName
        );
        const uniqueResults = response.results.map((row) => {
          const countryList = row.country.split(", ");

          return { ...row, country: countryList[0] };
        });
        //return { ...response, results: uniqueResults };

        setRows(uniqueResults);

        return;
      }
      if (data.caveID === "") {
        sessionStorage.setItem("CaveNameValue", data.caveName);
        sessionStorage.setItem("CaveIDValue", "");
        const response = await searchCaves(data.caveName, data.countryName);
        const responses = await Promise.all(
          response.results.map(async (row) => {
            const rowResponse = await getCaveById(row.id);
            const county = rowResponse?.entrances?.[0]?.county || "Unknown";
            const country = rowResponse?.entrances?.[0]?.country || "Unknown";
            return { ...rowResponse, country: country, county: county };
          })
        );
        setRows(responses);
      } else {
        sessionStorage.setItem("CaveIDValue", data.caveID);
        sessionStorage.setItem("CaveNameValue", "");
        const response = await getCaveById(data.caveID);
        const county = response[`entrances`]?.[0]["county"];
        const country = response[`entrances`]?.[0]["country"];
        setRows([{ ...response, country: country, county: county }]);
      }
    } catch (error) {
      console.error("Error fetching sensor types:", error);
    }
  };

  const navigate = useNavigate();

  const handleButtonClick = (row) => {
    navigate(`/authenticate/caves/${row.id}`);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                padding: 3,
                paddingInline: 5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "darkgray",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)", // Add shadow
                margin: "auto",
                marginTop: 3,
                maxWidth: "95%",
                minWidth: "60%", // Set a maximum width if needed
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {t("Search.title")}
              </Typography>
              <Box
                display="flex"
                marginBottom={2}
                sx={{ alignItems: "center" }}
              >
                <TextField
                  {...register("caveName")}
                  name="caveName"
                  defaultValue={sessionStorage.getItem("CaveNameValue") || ""}
                  label={t("Search.cave-name")}
                  size="small"
                  id="outlined-start-adornment"
                  sx={{ marginBottom: 1, width: "100%", marginInlineEnd: 1 }}
                />

                <TextField
                  {...register("caveID")}
                  name="caveID"
                  defaultValue={sessionStorage.getItem("CaveIDValue") || ""}
                  size="small"
                  label={t("Search.cave-id")}
                  id="outlined-start-adornment"
                  sx={{ marginBottom: 1, width: "100%", marginInlineStart: 1 }}
                />
              </Box>
              <Box
                display="flex"
                marginBottom={2}
                sx={{ alignItems: "center" }}
              >
                <Autocomplete
                  {...register("countryName")}
                  id="country-select-demo"
                  sx={{ width: "100%", marginInlineEnd: 1 }}
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
                      name="countryName"
                      size="small"
                      label={t("Search.country")}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: "45%", marginInlineStart: 1, height: "38px" }}
                >
                  {t("Search.search")}
                </Button>
              </Box>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              overflow: "hidden",
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
              margin: "25px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              maxWidth: "95%",
              marginInline: "auto",
            }}
          >
            <TableContainer
              sx={{ maxHeight: height * 0.7, minHeight: height * 0.43 }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {t(`Search.table.${column.id}`)}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format ? (
                                  <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleButtonClick(row)}
                                  >
                                    {t("Search.table.view")}
                                  </Button>
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={t("Search.table.rows")}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                height: "52px",
                "& .css-pdct74-MuiTablePagination-selectLabel": {
                  margin: 0, // Remove margin around the text input
                },
                "& .css-levciy-MuiTablePagination-displayedRows": {
                  margin: 0, // Remove margin around the text input
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
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
