import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Slider from "@mui/joy/Slider";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import { Input } from "@mui/joy";
import { getUsers } from "../../../apis/UserController.js";
import Layout from "../../Navbar/Layout.tsx";
import UsersList from "./UsersList.js";
import { useTranslation } from "react-i18next";

export default function Accounts() {
  const { t } = useTranslation("translation");
  const [usersList, setUsersList] = React.useState([]);
  const [nameFilter, setNameFilter] = React.useState("");
  const [licenseFilter, setLicenseFilter] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("any");
  const [searching, setSearching] = React.useState(false);
  const [membershipDurationFilter, setMembershipDurationFilter] =
    React.useState([0, 12]);
  React.useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      let data = await getUsers();

      data = applyFilters(
        data,
        nameFilter,
        licenseFilter,
        roleFilter,
        membershipDurationFilter
      );

      setUsersList(data);
      setSearching(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleSearchClick = () => {
    setSearching(true);

    fetchUsers();
  };
  const applyFilters = (data, name, license, role, membershipDuration) => {
    // Implement filtering logic based on the provided filters
    return data.filter((user) => {
      const nameMatch =
        (user?.firstName &&
          user.firstName.toLowerCase().includes(name.toLowerCase())) ||
        (user?.lastName &&
          user.lastName.toLowerCase().includes(name.toLowerCase()));
      const licenseMatch = user?.license.includes(license);
      const roleMatch = role === "any" || user?.role === role;

      // const createdAt = new Date(user.createdAt); // Assuming createdAt is a valid date field
      // const currentDate = new Date();
      // const startDate = currentDate.setMonth(
      //   currentDate.getMonth() - membershipDuration[1]
      // );
      // const endDate = currentDate.setMonth(
      //   currentDate.getMonth() - membershipDuration[0]
      // );
      // const membershipDurationMatch =
      //   createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      return nameMatch && licenseMatch && roleMatch; //&& membershipDurationMatch;
    });
  };

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
              {t("Accounts.member")}
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
            <Typography level="title-md">{t("Accounts.filters")}</Typography>
            <Button
              size="sm"
              variant="plain"
              sx={{ textTransform: "none" }}
              onClick={handleSearchClick}
              disabled={searching}
            >
              {t("Accounts.search")}
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
                  {t("Accounts.search")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 2 }}>
                  <Input
                    size="sm"
                    placeholder={t("Accounts.placeSearch")}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  {t("Accounts.license")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 1 }}>
                  <Input
                    size="sm"
                    placeholder={t("Accounts.license")}
                    value={licenseFilter}
                    onChange={(e) => setLicenseFilter(e.target.value)}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded disabled>
              <AccordionSummary>
                <Typography level="title-sm" sx={{ textTransform: "none" }}>
                  Role
                </Typography>
              </AccordionSummary>
              <AccordionDetails disabled>
                <Box sx={{ my: 2 }}>
                  <RadioGroup
                    name="role"
                    defaultValue=""
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
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
                  {t("Accounts.membership")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ my: 2 }}>
                  <Slider
                    size="sm"
                    valueLabelFormat={(value) =>
                      `${value} ${t("Accounts.months")}`
                    }
                    value={membershipDurationFilter}
                    onChange={(event, newValue) =>
                      setMembershipDurationFilter(newValue)
                    }
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
