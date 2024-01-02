import React, { useEffect, useState } from "react";

import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

function ShowMessage({ openvalue, message, status }) {
  const [open, setOpen] = useState(openvalue);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen((prevOpen) => {
      // Use a callback function to ensure proper handling of multiple state updates
      if (prevOpen !== openvalue) {
        return openvalue;
      }
      return prevOpen;
    });
  }, [openvalue]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ShowMessage;
