import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AddressDialog = ({ open, onClose, address, authToken }) => {
  const [editAddress, setEditAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (address) {
      setEditAddress(address);
    }
  }, [address]);

  const handleChange = (field) => (e) => {
    setEditAddress((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Replace with your API call
      await Change_Address(authToken, editAddress);
      onClose();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Address</DialogTitle>
      <DialogContent>
        {Object.keys(editAddress).map((key) => (
          <TextField
            key={key}
            margin="dense"
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            fullWidth
            value={editAddress[key]}
            onChange={handleChange(key)}
            sx={{ mb: 2 }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;
