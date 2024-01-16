/* eslint-disable jsx-a11y/anchor-is-valid */
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import React, { useState } from "react";
// icons
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useTranslation } from "react-i18next";

function RowMenu() {
  const { t } = useTranslation("translation");
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>{t("Obs.table.edit")}</MenuItem>

        <Divider />
        <MenuItem color="danger">{t("Obs.table.delete")}</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function FileTable({ rows }) {
  const { t } = useTranslation("translation");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const rowsPerPage = 10; // Set the desired number of rows per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedRows = rows.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const downloadFile = (row) => {
    window.open(row.filePath, "_blank");
  };

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>{t("Obs.sensor")}</FormLabel>
        <Select size="md" sx={{ height: "38.6px" }} placeholder={t("Obs.all")}>
          <Option value="all">{t("Obs.all")}</Option>
          <Option value="reefnet">Reefnet Sensor</Option>
          <Option value="ctd">CTD Sensor</Option>
          <Option value="pluviometer">PluvioMeter</Option>
          <Option value="other">Other</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>{t("Obs.author")}</FormLabel>
        <Select size="md" sx={{ height: "38.6px" }} placeholder={t("Obs.all")}>
          <Option value="all">{t("Obs.all")}</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder={t("Obs.search")}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: {
            xs: "none",
            sm: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>{t("Obs.serach-label")}</FormLabel>
          <Input
            size="sm"
            placeholder={t("Obs.search")}
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
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
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 12px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: "25%", padding: "12px 6px" }}>
                {t("Obs.table.file-name")}
              </th>
              <th style={{ width: "12%", padding: "12px 6px" }}>Sensor</th>
              <th style={{ width: "12%", padding: "12px 6px" }}>
                {t("Obs.table.sensor")}
              </th>

              <th style={{ width: "14%", padding: "12px 6px" }}>
                {t("Obs.table.begin-date")}
              </th>
              <th style={{ width: "14%", padding: "12px 6px" }}>
                {t("Obs.table.end-date")}
              </th>
              <th style={{ width: "17%", padding: "12px 6px" }}>
                {t("Obs.table.author")}
              </th>
              <th style={{ width: "4%", padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(startIndex, endIndex).length != 0 ? (
              rows.slice(startIndex, endIndex).map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? "primary" : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id)
                            : ids.filter((itemId) => itemId !== row.id)
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.fileName}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {row?.isObservedBy?.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.sensor_type}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.beginDate}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row?.endDate}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar size="sm">{row?.customer?.initial}</Avatar>
                      <div>
                        <Typography level="body-xs">
                          {row?.customer?.name}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link
                        level="body-xs"
                        component="button"
                        onClick={() => downloadFile(row)}
                      >
                        <IconButton color="primary" aria-label="download">
                          <FileDownloadIcon />
                        </IconButton>
                      </Link>
                    </Box>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>{t("Obs.loading")}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          {t("Obs.table.previous")}
        </Button>

        <Box sx={{ flex: 1 }} />
        {Array.from({ length: totalPages }, (_, index) => (
          <IconButton
            key={index + 1}
            size="sm"
            variant={currentPage === index + 1 ? "outlined" : "plain"}
            color="neutral"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {t("Obs.table.next")}
        </Button>
      </Box>
    </React.Fragment>
  );
}
