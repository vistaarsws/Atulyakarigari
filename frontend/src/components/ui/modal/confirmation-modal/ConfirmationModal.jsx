import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "xs" : isLargeScreen ? "md" : "sm"} // Small modal on large screens
      sx={{
        "& .MuiDialog-paper": {
          width: isLargeScreen ? "40%" : "90%", // 40% width on large screens, 90% on smaller screens
          maxWidth: "500px", // Prevents the modal from becoming too wide
          margin: "auto",
        },
      }}
    >
      <DialogTitle>{title || "Confirm Action"}</DialogTitle>
      <DialogContent>{message || "Are you sure?"}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
