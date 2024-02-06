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
                {t("Home.title")}
              </Typography>
              <Typography mb={1} sx={{ lineHeight: 2, textAlign: "justify" }}>
                {t("Home.content")}
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
