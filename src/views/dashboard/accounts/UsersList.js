import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/joy/Box";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Button from "@mui/joy/Button";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { searchObservations } from "../../../apis/CaveObservationController";
import { deleteUser } from "../../../apis/UserController";

function Row({ dataRow, initialOpen, onDelete }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(initialOpen || false);
  const [row, setRow] = useState(dataRow);
  const [opendelete, setOpendelete] = React.useState(false);
  const downloadFile = (row) => {
    window.open(row.filePath, "_blank");
    //const parts = row?.filePath.split("/");

    // Get the last part of the array (which is the part after the last "/")
    //const fileName = parts[parts.length - 1];
    //window.open("http://127.0.0.1:8083/uploads/" + fileName, "_blank");
  };
  const deleteRow = async () => {
    try {
      await deleteUser(row._id);
      onDelete(row._id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  useEffect(() => {
    // Check if dataRow?._id exists
    if (!dataRow?._id) {
      // If it doesn't exist, you can return early or handle it as per your requirement.
      console.log("dataRow._id does not exist. Skipping request.");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const responseDetails = await searchObservations(
          `{"createdBy":"${dataRow._id}"}`,
          0,
          1
        );

        setRow((prevRow) => ({ ...prevRow, details: responseDetails }));
      } catch (error) {
        setRow((prevRow) => ({ ...prevRow, details: [""] }));
        console.error("Error fetching Notification:", error);
      }
    };

    fetchUserDetails();
  }, [open, dataRow?._id]);

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
        <th scope="row">
          {row?.firstName} {row?.lastName}
        </th>
        <td>{row?.role}</td>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.email || "anonymous@gmail.com"}
        </td>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.address}
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
                  {t("Accounts.details")}
                </Typography>
                <Button
                  variant="soft"
                  color="danger"
                  startDecorator={<DeleteIcon />}
                  size="sm"
                  onClick={() => setOpendelete(true)}
                  sx={{ textTransform: "none", marginInlineEnd: 1 }}
                >
                  {t("Sensors.delete")}
                </Button>
                <Modal open={opendelete} onClose={() => setOpendelete(false)}>
                  <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                      <WarningRoundedIcon />
                      Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <div>
                        {t("Sensors.delete-message")}{" "}
                        <strong>
                          {row?.firstName} {row?.lastName}
                        </strong>{" "}
                        ?
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="solid"
                        color="danger"
                        onClick={() => {
                          deleteRow();
                          setOpendelete(false);
                        }}
                      >
                        {t("Sensors.delete")}
                      </Button>
                      <Button
                        variant="plain"
                        color="neutral"
                        onClick={() => setOpendelete(false)}
                      >
                        {t("Settings.cancel")}
                      </Button>
                    </DialogActions>
                  </ModalDialog>
                </Modal>
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
                    <th style={{ width: "25%" }}>
                      {t("Accounts.account-creation")}
                    </th>
                    <th style={{ width: "25%" }}>{t("Accounts.license")}</th>
                    <th style={{ width: "50%" }}>{t("Accounts.last-added")}</th>
                  </tr>
                </thead>
                <tbody>
                  {row?.details?.map((detailsRow) => (
                    <tr key={row?._id}>
                      <th scope="row">
                        {dayjs(row?.createdAt).format("MMM D, YYYY hh:mm")}
                      </th>
                      <td>{row?.license}</td>
                      <td>
                        <Link
                          level="body-xs"
                          component="button"
                          onClick={() => downloadFile(detailsRow?.filePath)}
                        >
                          {detailsRow?.fileName}
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

function UsersList({ rows, deleteUser }) {
  const { t } = useTranslation("translation");

  return (
    <div>
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
              <th style={{ width: "20%" }}>{t("Accounts.name")}</th>
              <th style={{ width: "10%" }}>Role</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "40%" }}>{t("Accounts.address")}</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, index) => (
              <Row
                key={row?._id}
                dataRow={row}
                initialOpen={index === 0}
                onDelete={deleteUser}
              />
            ))}
          </tbody>
        </Table>
      </Sheet>
    </div>
  );
}

export default UsersList;
