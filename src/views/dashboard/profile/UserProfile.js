import Link from "@mui/joy/Link";
import { listItemDecoratorClasses } from "@mui/joy/ListItemDecorator";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { GridDeleteIcon } from "@mui/x-data-grid";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCaveById } from "../../../apis/CaveController";
import {
  deleteObservation,
  searchObservations,
} from "../../../apis/CaveObservationController";
import { getSensorTypeById } from "../../../apis/SensorTypeController";
import { fetchUserInfo } from "../../../apis/UserController";

export default function UserProfile() {
  const email = localStorage.getItem("email");
  const { t } = useTranslation("translation");
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: email,
    license: "",
    createdAt: "",
  });
  const [groupedData, setGroupedData] = useState([]);
  const [selectedCaveData, setSelectedCaveData] = useState([]);

  const handleDelete = async (row) => {
    const res = await deleteObservation(row.id);
  };

  const downloadFile = (row) => {
    //window.open(row.filePath, '_blank');
    const parts = row?.filePath.split("/");

    // Get the last part of the array (which is the part after the last "/")
    const fileName = parts[parts.length - 1];
    window.open("http://127.0.0.1:8083/uploads/" + fileName, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserInfo();
        setUser({
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          email: email,
          address: userData.address,
          country: userData.country,
          license: userData.license,
          createdAt: userData.createdAt,
        });
      } catch (error) {
        console.error("Error fetching sensor types:", error);
        // Handle errors as needed
      }
    };

    const fetchUserObs = async () => {
      try {
        const originalData = await searchObservations(
          `{"createdBy":"${user._id}"}`
        );

        // Group the data by caveId
        const groupedByCaveId = originalData.reduce((acc, item) => {
          const { caveId } = item;
          if (!acc[caveId]) {
            acc[caveId] = [];
          }
          acc[caveId].push(item);
          return acc;
        }, {});
        // Set the grouped data in the state
        setGroupedData(groupedByCaveId);
        const uniqueCaveIds = Object.keys(groupedByCaveId);

        // Use Promise.all to wait for all requests to complete
        await Promise.all(
          uniqueCaveIds.map(async (caveId) => {
            try {
              const response = await getCaveById(caveId);
              const caveName = response.name;

              // Update state with cave name
              setGroupedData((prevData) => ({
                ...prevData,
                [caveId]: prevData[caveId].map((item) => ({
                  ...item,
                  caveName,
                })),
              }));

              setSelectedCaveData(groupedData[0]);
            } catch (error) {
              console.error(`Error fetching cave name for ${caveId}:`, error);
            }
          })
        );
      } catch (error) {
        console.log("Error getting user contributions");
      }
    };

    fetchData();
    fetchUserObs();
    // Mark the page as refreshed
  }, [user.license]);

  const getinfofile = async (data) => {
    const responses = await Promise.all(
      data.map(async (item) => {
        //const formattedEndDate = item?.endDate ? dayjs(item.endDate).format('MMM DD, YYYY') : 'no_date';

        const sensorID = item?.sensorId || "";
        const resSensor = await getSensorTypeById(sensorID);

        return { ...item, sensor_type: resSensor?.data?.type };
      })
    );
    return responses;
  };
  const caveNames = Object.values(groupedData).map((caveId) => ({
    id: caveId[0].caveId,
    text: caveId[0].caveName,
  }));

  return (
    <Box>
      <Container sx={{ py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid item lg={4} md={4} justifyContent="center" alignItems="center">
            <Card
              sx={{ pt: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                sx={{ width: 150, height: 150 }}
              />
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="textSecondary" paragraph>
                  {user.role}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {dateFormat(user.createdAt, "dddd, mmmm dS, yyyy")}
                </Typography>
              </CardContent>
            </Card>
            <br />
            <Card sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }}>
              <CardContent
                sx={{
                  padding: 0,
                  height: "100%",
                  overflowY: "auto",
                  minHeight: "70px",
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
                <List
                  aria-label="Sidebar"
                  sx={{
                    "--ListItem-paddingLeft": "0px",
                    "--ListItemDecorator-size": "64px",
                    "--ListItem-minHeight": "32px",
                    "--List-nestedInsetStart": "13px",
                    [`& .${listItemDecoratorClasses.root}`]: {
                      justifyContent: "flex-end",
                      pr: "18px",
                    },
                    '& [role="button"]': {
                      borderRadius: "0 20px 20px 0",
                    },
                    padding: 0,
                  }}
                  className="rounded-3"
                >
                  {caveNames.map((item, indexdata) => (
                    <React.Fragment key={indexdata}>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={index === indexdata}
                          onClick={async () => {
                            setIndex(indexdata);

                            const info = await getinfofile(
                              groupedData[item.id]
                            );
                            setSelectedCaveData(info);
                          }}
                          component="a"
                          href="#simple-list"
                          className="d-flex justify-content-between align-items-center p-3"
                        >
                          <ListItemText primary={item.text} />
                        </ListItemButton>
                      </ListItem>
                      {indexdata !== caveNames.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={8} md={8}>
            <Card
              className="mb-4"
              sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              <CardContent>
                <Grid container>
                  {[
                    {
                      label: `${t("User.name")}`,
                      value: `${user.firstName} ${user.lastName}`,
                    },
                    { label: `${t("User.license")}`, value: user.license },
                    { label: `${t("User.email")}`, value: user.email },
                    { label: `${t("User.address")}`, value: user.address },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <Grid item sm={3}>
                        <Typography>{item.label}</Typography>
                      </Grid>
                      <Grid item sm={9}>
                        <Typography className="text-muted">
                          {item.value}
                        </Typography>
                      </Grid>
                      {index < 3 && (
                        <Grid item xs={12}>
                          <br />
                          <Divider />
                          <br />
                        </Grid>
                      )}
                    </React.Fragment>
                  ))}
                </Grid>
              </CardContent>
            </Card>
            <br />
            <Grid container spacing={3} style={{ height: "47vh" }}>
              {[...Array(1)].map((_, index) => (
                <Grid item md={12} key={index} style={{ height: "100%" }}>
                  <Card
                    className="mb-4"
                    sx={{
                      height: "100%",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <CardContent sx={{ padding: 0, paddingLeft: 1 }}>
                      <Sheet
                        sx={{
                          "--TableCell-height": "40px",
                          // the number is the amount of the header rows.
                          "--TableHeader-height":
                            "calc(1 * var(--TableCell-height))",
                          height: "43.5vh",
                          overflow: "auto",
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
                          background: (theme) =>
                            `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
                            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
                            radial-gradient(
                              farthest-side at 50% 0,
                              rgba(0, 0, 0, 0.12),
                              rgba(0, 0, 0, 0)
                            ),
                            radial-gradient(
                                farthest-side at 50% 100%,
                                rgba(0, 0, 0, 0.12),
                                rgba(0, 0, 0, 0)
                              )
                              0 100%`,
                          backgroundSize:
                            "100% 40px, 100% 40px, 100% 14px, 100% 14px",
                          backgroundRepeat: "no-repeat",
                          backgroundAttachment: "local, local, scroll, scroll",
                          backgroundPosition:
                            "0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%",
                          backgroundColor: "background.surface",
                        }}
                      >
                        <Table stickyHeader>
                          <thead>
                            <tr>
                              <th style={{ width: 50 }}>{t("User.row")}</th>
                              <th style={{ width: 125 }}>{t("User.sensor")}</th>
                              <th style={{ width: 155 }}>{t("User.added")}</th>
                              <th style={{ width: 260 }}>
                                {t("User.file-name")}
                              </th>
                              {user.role === "admin" ? (
                                <th style={{ width: 40 }}></th>
                              ) : (
                                <></>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCaveData?.map((row, index) => (
                              <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{row?.sensor_type}</td>
                                <td>
                                  {row?.createdAt
                                    ? dayjs(row.createdAt).format(
                                        "MMM D, YYYY  hh:mm"
                                      )
                                    : "no_date"}
                                </td>
                                <td>
                                  <Link
                                    level="body-xs"
                                    component="button"
                                    onClick={() => downloadFile(row)}
                                  >
                                    {row?.fileName ? row?.fileName : "Unnamed"}
                                  </Link>
                                </td>
                                {user.role === "admin" ? (
                                  <td>
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() => handleDelete(row)}
                                    >
                                      <GridDeleteIcon color="warning" />
                                    </IconButton>
                                  </td>
                                ) : (
                                  <></>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Sheet>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
