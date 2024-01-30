import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Grid, Paper } from "@mui/material";

function Home() {
  const { t } = useTranslation("translation");

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* General description */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              <Typography variant="h4" mb={2}>
                General Description
              </Typography>
              <Typography mb={1} sx={{ lineHeight: 2, textAlign: "justify" }}>
                KarstLink2, a dynamic web platform, serves as a collaborative
                network for speleologists and underground data enthusiasts,
                streamlining the storage and retrieval of valuable observations
                related to karst environments. The website offers an intuitive
                interface with advanced search capabilities, supporting
                multilingual functionality for accessibility. Integrated with
                essential sources like Grottocenter, KarstLink ensures a
                comprehensive and diverse dataset, fostering collaboration among
                speleologists, researchers, and enthusiasts. A speleologist, as
                an expert in cave exploration, contributes to this platform by
                conducting field surveys, collecting data on cave systems, and
                advancing our understanding of subterranean ecosystems. Their
                work is pivotal in promoting conservation efforts and scientific
                advancements in the study of caves and karst landscapes. Join
                KarstLink2 in unlocking the mysteries of the underground world
                and contributing to a global community passionate about
                subterranean exploration.
              </Typography>
            </div>
          </Paper>
        </Grid>

        {/* Image */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={require("../../images/home.png")}
              alt="Description"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
