import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/joy/Link";
function createData(name, role, email, address) {
  return {
    name,
    role,
    email,
    address,
    details: [
      {
        date: "2020-01-05",
        country: "France",
        lastObservation: "SU-12821-SiphonVillebruc-mars-juin2021.csv",
      },
    ],
  };
}

function Row({ row, initialOpen }) {
  const [open, setOpen] = useState(initialOpen || false);
  const downloadFile = (row) => {
    window.open(row.filePath, "_blank");
    //const parts = row?.filePath.split("/");

    // Get the last part of the array (which is the part after the last "/")
    //const fileName = parts[parts.length - 1];
    //window.open("http://127.0.0.1:8083/uploads/" + fileName, "_blank");
  };
  return (
    <>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <th scope="row">{row.name}</th>
        <td>{row.role}</td>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.email}
        </td>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.address}
        </td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={6}>
          {open && (
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography level="body-lg" component="div">
                  Details
                </Typography>
                <Button
                  variant="soft"
                  color="danger"
                  startDecorator={<DeleteIcon />}
                  size="sm"
                  sx={{ textTransform: "none", marginInlineEnd: 1 }}
                >
                  Delete
                </Button>
              </Box>
              <Table
                stickyHeader
                borderAxis="bothBetween"
                size="sm"
                aria-label="purchases"
                sx={{
                  "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                    { textAlign: "left" },
                  "--TableCell-paddingX": "0.5rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Account Creation Date</th>
                    <th style={{ width: "25%" }}>Country</th>
                    <th style={{ width: "50%" }}>Last added observation</th>
                  </tr>
                </thead>
                <tbody>
                  {row.details.map((detailsRow) => (
                    <tr key={detailsRow.date}>
                      <th scope="row">{detailsRow.date}</th>
                      <td>{detailsRow.country}</td>
                      <td>
                        <Link
                          level="body-xs"
                          component="button"
                          onClick={() => downloadFile(detailsRow)}
                        >
                          {detailsRow?.lastObservation
                            ? detailsRow?.lastObservation
                            : "Unnamed"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </td>
      </tr>
    </>
  );
}

const rows = [
  createData(
    "Halim Elleuch",
    "User",
    "halim.elleuch@mail.com",
    "450 Route des Chappes, 06410 Biot"
  ),
  createData(
    "Anonymous 123",
    "Admin",
    "anonymous@mail.com",
    "450 Route des Chappes, 06410 Biot"
  ),
  createData(
    "Halim Elleuch",
    "User",
    "halim.elleuch@mail.com",
    "450 bd du president wilson, 06600 antibes"
  ),
  createData(
    "Anonymous 123",
    "Admin",
    "anonymous@mail.com",
    "450 Route des Dolines, 06560 valbonne"
  ),
  createData(
    "Halim Elleuch",
    "User",
    "halim.elleuch@mail.com",
    "450 Route des Chappes, 06410 Biot"
  ),
  createData(
    "Anonymous 123",
    "Admin",
    "anonymous@mail.com",
    "450 Route des Dolines, 06560 valbonne"
  ),
];

function UsersList() {
  return (
    <div>
      <div
        style={{
          fontSize: "16px",
          color: "#555E68",
          textAlign: "center",
          margin: 2,
        }}
      >
        Selected Users
      </div>
      <Sheet
        sx={{
          "--TableCell-height": "40px",
          // the number is the amount of the header rows.
          "--TableHeader-height": "calc(1 * var(--TableCell-height))",
          height: "88vh",
          overflow: "auto",
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
          backgroundSize: "100% 40px, 100% 40px, 100% 14px, 100% 14px",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "local, local, scroll, scroll",
          backgroundPosition:
            "0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%",
          backgroundColor: "background.surface",
        }}
      >
        <Table
          stickyHeader
          aria-label="collapsible table"
          sx={{
            "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
              { textAlign: "left" },
            '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
              { borderBottom: 0 },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 40 }} aria-label="empty" />
              <th style={{ width: "20%" }}>Full Name</th>
              <th style={{ width: "10%" }}>Role</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "40%" }}>Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <Row key={row.name} row={row} initialOpen={index === 0} />
            ))}
          </tbody>
        </Table>
      </Sheet>
    </div>
  );
}

export default UsersList;
