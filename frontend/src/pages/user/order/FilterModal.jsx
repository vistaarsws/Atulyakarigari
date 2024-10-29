import { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  FormControlLabel,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FilterModal = ({ open, handleClose }) => {
  const [filters, setFilters] = useState({
    status: "all",
    time: "anytime",
  });

  const handleStatusChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleTimeChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      time: event.target.value,
    }));
  };

  const handleReset = () => {
    setFilters({
      status: "all",
      time: "anytime",
    });
  };

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "On the way", value: "ontheway" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ];

  const timeOptions = [
    { label: "Anytime", value: "anytime" },
    { label: "Last 30 days", value: "last30days" },
    { label: "Last 6 months", value: "last6months" },
    { label: "Last Year", value: "lastyear" },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-orders-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "300px",
          p: 3,
          outline: "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#383737" }}
          >
            Filter Orders
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "#383737",
              mb: 1,
            }}
          >
            Status
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    checked={filters.status === option.value}
                    onChange={handleStatusChange}
                    value={option.value}
                    size="medium"
                    sx={{
                      color: "#60A487",
                      "&.Mui-checked": {
                        color: "#60A487",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "1.4rem",
                      color: "#6F6F6F",
                      fontWeight: 400,
                    }}
                  >
                    {option.label}
                  </Typography>
                }
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "#383737",
              mb: 1,
            }}
          >
            Time
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {timeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    checked={filters.time === option.value}
                    onChange={handleTimeChange}
                    value={option.value}
                    size="medium"
                    sx={{
                      color: "#60A487",
                      "&.Mui-checked": {
                        color: "#60A487",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "1.4rem",
                      color: "#6F6F6F",
                      fontWeight: 400,
                    }}
                  >
                    {option.label}
                  </Typography>
                }
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              fontSize: "11px",
              backgroundColor: "#B22222",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#8B0000" },
            }}
            onClick={handleClose}
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              fontSize: "11px",
              borderColor: "#60A487",
              color: "#60A487",
              textTransform: "none",
              "&:hover": {
                borderColor: "#60A487",
                backgroundColor: "#60A487",
                color: "white",
              },
            }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
