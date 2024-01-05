import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Autocomplete from "@mui/joy/Autocomplete";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Slider from "@mui/joy/Slider";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import Layout from "../../Navbar/Layout.tsx";
import UsersList from "./UsersList.js";
import { getUsers } from "../../../apis/UserController.js";
import { Input } from "@mui/joy";

export default function Accounts() {
  const [usersList, setUsersList] = React.useState([]);
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsersList(data);
      } catch (error) {}
    };
    fetchUsers();
  }, []);
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.appBody",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: " minmax(450px, 1fr)",
            md: "minmax(250px, 450px) minmax(500px, 1fr)",
          },

          minHeight: "92vh",
        }}
      >
        <Layout.SidePane>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography level="title-lg" textColor="text.secondary">
              People
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography level="title-md">Filters</Typography>
            <Button size="sm" variant="plain" sx={{ textTransform: "none" }}>
              Clear
            </Button>
          </Box>
          <AccordionGroup
            sx={{
              [`& .${accordionDetailsClasses.content}`]: {
                px: 2,
              },
              [`& .${accordionSummaryClasses.button}`]: {
                px: 2,
              },
            }}
          >
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  Search
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 2 }}>
                  <Autocomplete
                    size="sm"
                    placeholder="Name, Email, etc…"
                    options={[
                      {
                        category: "Job",
                        title: "Speleologist",
                      },
                      {
                        category: "Job",
                        title: "Professor",
                      },
                      {
                        category: "Job",
                        title: "Developer",
                      },
                    ]}
                    groupBy={(option) => option.category}
                    getOptionLabel={(option) => option.title}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  License ID
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 1 }}>
                  <Input size="sm" placeholder="License ID" />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  Role
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 2 }}>
                  <RadioGroup name="job" defaultValue="any">
                    <Radio label="Any" value="any" size="sm" />
                    <Radio label="User" value="user" size="sm" />
                    <Radio label="Admin" value="admin" size="sm" />
                  </RadioGroup>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  Membership Duration
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 2 }}>
                  <Slider
                    size="sm"
                    valueLabelFormat={(value) => `${value} months`}
                    defaultValue={[5, 10]}
                    step={1}
                    min={0}
                    max={30}
                    valueLabelDisplay="on"
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
        </Layout.SidePane>

        <UsersList rows={usersList} />
      </Box>
    </>
  );
}
