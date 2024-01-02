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

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Layout from "../../Navbar/Layout.tsx";
import UsersList from "./UsersList.js";

export default function Accounts() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const peopleData = [
    {
      name: "Andrew Smith",
      position: "UI Designer",
      avatar2x: "https://i.pravatar.cc/80?img=7",
      companyData: [
        {
          role: "Senior designer",
          name: "Dribbble",
          logo: "https://www.vectorlogo.zone/logos/dribbble/dribbble-icon.svg",
          years: "2015-now",
        },
        {
          role: "Designer",
          name: "Pinterest",
          logo: "https://www.vectorlogo.zone/logos/pinterest/pinterest-icon.svg",
          years: "2012-2015",
        },
      ],
      skills: ["UI design", "Illustration"],
    },
    {
      name: "John Doe",
      position: "Frontend Developer",
      avatar2x: "https://i.pravatar.cc/80?img=8",
      companyData: [
        {
          role: "UI Engineer",
          name: "Google",
          logo: "https://www.vectorlogo.zone/logos/google/google-icon.svg",
          years: "2018-now",
        },
        {
          role: "Frontend Developer",
          name: "Amazon",
          logo: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg",
          years: "2015-2018",
        },
      ],
      skills: ["HTML", "CSS", "JavaScript"],
    },
    {
      name: "Alice Johnson",
      position: "Product Manager",
      avatar2x: "https://i.pravatar.cc/80?img=9",
      companyData: [
        {
          role: "Product Manager",
          name: "Microsoft",
          logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg",
          years: "2016-now",
        },
        {
          role: "Product Analyst",
          name: "IBM",
          logo: "https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg",
          years: "2013-2016",
        },
      ],
      skills: ["Product Management", "Market Analysis"],
    },
    {
      name: "Eva Brown",
      position: "Graphic Designer",
      avatar2x: "https://i.pravatar.cc/80?img=10",
      companyData: [
        {
          role: "Art Director",
          name: "Adobe",
          logo: "https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg",
          years: "2019-now",
        },
        {
          role: "Graphic Designer",
          name: "Apple",
          logo: "https://www.vectorlogo.zone/logos/apple/apple-icon.svg",
          years: "2016-2019",
        },
      ],
      skills: ["Graphic Design", "Illustration"],
    },
  ];

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
                  Location
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 1 }}>
                  <Autocomplete
                    size="sm"
                    placeholder="Country, city, etc…"
                    options={[
                      // some of Thailand provinces
                      "Antibes",
                      "Marseille",
                      "Paris",
                      "Nantes",
                    ]}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  Job
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

        <UsersList />
      </Box>
    </>
  );
}
