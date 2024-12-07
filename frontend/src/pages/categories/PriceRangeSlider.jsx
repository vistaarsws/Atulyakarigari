import React, { useState } from "react";
import { Box, Slider, Typography, styled } from "@mui/material";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "#10B981",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    // width: 20,
    backgroundColor: "#10B981",
    border: "2px solid white",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 8px rgba(16, 185, 129, 0.16)",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    display: "none",
  },
}));

export default function PriceRangeSlider({ min, max, onChange }) {
  const [value, setValue] = useState(min);

  const handleChange = (_event, newValue) => {
    const numValue = newValue;
    setValue(numValue);
    onChange?.(numValue);
  };
  return (
    <Box>
      <Typography
        gutterBottom
        sx={{ fontSize: "14px", fontWeight: 500, color: "#383737" }}
      >
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <StyledSlider
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
          aria-label="Price range"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography sx={{ fontSize: "12px" }} color="text.secondary">
            {min.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "12px" }} fontWeight="500">
            {value.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "12px" }} color="text.secondary">
            {max.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
