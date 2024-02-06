import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation("translation");
  return (
    <Box
      sx={{
        height: "92vh",
        backgroundColor: "white",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2>{t("Help.Introduction")}</h2>
      <div>{t("Help.Content")}</div>

      <h2>{t("Help.Modules.User_Registration_and_Authentication.Title")}</h2>
      <h3 style={{ textDecoration: "underline" }}>
        {t(
          "Help.Modules.User_Registration_and_Authentication.Register_Page.Title"
        )}
      </h3>
      <div>
        <ul>
          {t(
            "Help.Modules.User_Registration_and_Authentication.Register_Page.Description",
            { returnObjects: true }
          ).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t(
          "Help.Modules.User_Registration_and_Authentication.Login_Page.Title"
        )}
      </h3>
      <div>
        <ul>
          {t(
            "Help.Modules.User_Registration_and_Authentication.Login_Page.Description",
            { returnObjects: true }
          ).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h2>{t("Help.Modules.Admin_Dashboard.Title")}</h2>
      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Profile_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Profile_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Settings_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Settings_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Managing_Accounts_Page.Title")}
      </h3>
      <div>
        <ul>
          {t(
            "Help.Modules.Admin_Dashboard.Managing_Accounts_Page.Description",
            { returnObjects: true }
          ).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Observation_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Observation_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Sensor_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Sensor_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Sensor_Type_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Sensor_Type_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Admin_Dashboard.Notification_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Admin_Dashboard.Notification_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h2>{t("Help.Modules.Contribution.Title")}</h2>
      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Contribution.Contribution_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Contribution.Contribution_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h2>{t("Help.Modules.Search.Title")}</h2>
      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Search.Search_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Search.Search_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Search.Cave_Observation_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Search.Cave_Observation_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <h2>{t("Help.Modules.Map.Title")}</h2>
      <h3 style={{ textDecoration: "underline" }}>
        {t("Help.Modules.Map.Map_Page.Title")}
      </h3>
      <div>
        <ul>
          {t("Help.Modules.Map.Map_Page.Description", {
            returnObjects: true,
          }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default Contact;
