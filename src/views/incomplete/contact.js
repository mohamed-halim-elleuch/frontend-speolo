import React from "react";
import { Box } from "@mui/material";

const Contact = () => {
  return (
    <Box
      sx={{
        height: "92vh",
        backgroundColor: "white",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2>Introduction:</h2>
      <div>
        This project aims to develop a dynamic web application dedicated to
        simplifying the storage and retrieval of underground observation data,
        emphasizing time series data collected from sensors measuring various
        parameters. The web application provides users with an intuitive
        interface, advanced search capabilities, and multilingual functionality
        (French and English). For administrators, an Admin Dashboard enhances
        control with features like notification displays, account management,
        and observation and sensor type control. The platform also incorporates
        mapping features and proximity search functionality.
      </div>

      <h2>Modules:</h2>

      <h3 style={{ textDecoration: "underline" }}>
        User Registration and Authentication:
      </h3>
      <h4>Register Page:</h4>
      <div>
        <ul>
          <li>Collects essential information for user profiles.</li>
          <li>
            Validates password strength and checks for duplicate email/license.
          </li>
        </ul>
      </div>

      <h4>Login Page:</h4>
      <div>
        <ul>
          <li>Secure entry for registered users.</li>
          <li>Alerts for incorrect email or password entries.</li>
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>Admin Dashboard:</h3>
      <h4>Profile Page:</h4>
      <div>
        <ul>
          <li>
            Showcases vital user details. Displays contributions made by the
            user in selected caves.
          </li>
        </ul>
      </div>

      <h4>Settings Page:</h4>
      <div>
        <ul>
          <li>
            Allows users to personalize their profile. Certain fields (email,
            license, role) are marked as read-only for data integrity.{" "}
          </li>
        </ul>
      </div>

      <h4>Managing Accounts Page:</h4>
      <div>
        <ul>
          <li>
            Exclusive for administrators to oversee all registered accounts.
            Features robust filtering capabilities for efficient account
            management.
          </li>
        </ul>
      </div>

      <h4>Observation Page:</h4>
      <div>
        <ul>
          <li>
            Central hub for exploring and managing observations. Detailed
            information about selected observations for analysis and
            decision-making.
          </li>
        </ul>
      </div>

      <h4>Sensor Page:</h4>
      <div>
        <ul>
          <li>
            Overview of sensors through a user-friendly table. Detailed view for
            editing or deleting selected sensors.
          </li>
        </ul>
      </div>

      <h4>Sensor Type Page:</h4>
      <div>
        <ul>
          <li>
            Dedicated space for managing sensor types efficiently. Detailed view
            for editing or deleting selected sensor types.
          </li>
        </ul>
      </div>

      <h4>Notification Page:</h4>
      <div>
        <ul>
          <li>
            Exclusively for administrators to receive notifications about
            deleted objects. Notifications include details about the deleted
            object's properties and the user who performed the deletion.
          </li>
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>Contribution:</h3>
      <h4>Contribution Page:</h4>
      <div>
        <ul>
          <li>
            Allows authenticated users to add data to the database through
            various input options. Users can contribute observations with
            details like cave ID, location, sensor, datetime, and file upload.
          </li>
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>Search:</h3>
      <h4>Search Page:</h4>
      <div>
        <ul>
          <li>
            Empowers users to navigate through the database using various search
            parameters. Offers flexible options for exploration with detailed
            information about caves.
          </li>
        </ul>
      </div>

      <h4>Cave Observation Page:</h4>
      <div>
        <ul>
          <li>
            Functions as a user interface, providing access to specific cave
            data. Allows users to retrieve data related to a particular cave
            through a GET request to the backend API.
          </li>
        </ul>
      </div>
      <h3 style={{ textDecoration: "underline" }}>Map:</h3>
      <h4>Map Page:</h4>
      <div>
        <ul>
          <li>
            Provides an engaging and interactive experience for exploring
            geographical data. Users can draw rectangles on the map, switch
            between map layers, and access detailed information about selected
            caves.
          </li>
        </ul>
      </div>
    </Box>
  );
};

export default Contact;
