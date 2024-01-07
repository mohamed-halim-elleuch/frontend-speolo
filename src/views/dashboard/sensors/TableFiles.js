import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { Divider, Sheet, Table, Typography } from "@mui/joy";
import {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function TableFiles({
  rows,
  dataLength,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  selectedRow,
  setSelectedRow,
}) {
  const { t } = useTranslation("translation");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
    // Perform any other actions when a row is clicked
  };

  return (
    <div>
      <Sheet
        sx={{
          maxHeight: "55.5vh",
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
        }}
      >
        <Table
          stickyHeader
          stickyFooter
          hoverRow
          size="sm"
          borderAxis="none"
          variant="soft"
          sx={{
            "--TableCell-paddingX": "0.8rem",
            "--TableCell-paddingY": "0.75rem",
          }}
        >
          <TableHead sx={{ overflow: "hidden" }}>
            <TableRow>
              <TableCell style={{ width: "30%" }}>
                <Typography level="title-sm">{t("Obs.sensor")}</Typography>
              </TableCell>
              <TableCell style={{ width: "20%" }}>
                <Typography level="title-sm">
                  {t("Sensors.is-default")}
                </Typography>
              </TableCell>
              <TableCell style={{ width: "27%" }}>
                <Typography level="title-sm">{t("Sensors.author")}</Typography>
              </TableCell>
              <TableCell style={{ width: "23%" }}>
                <Typography level="title-sm">
                  {t("Sensors.manufacturer")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(index)} // Handle row click
                  selected={selectedRow === index} // Apply selected style
                >
                  <TableCell>
                    <Typography
                      level="title-sm"
                      startDecorator={<TextSnippetIcon color="primary" />}
                      sx={{ alignItems: "flex-start" }}
                    >
                      {row.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: "14px", color: "#555E70" }}>
                      {row.isDefault ? "True" : "False"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: "14px", color: "#555E70" }}>
                      {row.user}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: "14px", color: "#555E70" }}>
                      {row.manufacturer}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Sheet>
      <Divider />
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dataLength}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage={t("Search.table.rows")}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          height: "52px",
          "& .css-pdct74-MuiTablePagination-selectLabel": {
            margin: 0,
          },
          "& .css-levciy-MuiTablePagination-displayedRows": {
            margin: 0,
          },
        }}
      />
    </div>
  );
}
