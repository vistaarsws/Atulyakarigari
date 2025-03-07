import React, { useState } from "react";
import { Box, Slider, Typography, styled } from "@mui/material";
import { formatPrice } from "../../../utils/helpers";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "#60a487",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    backgroundColor: "#60a487",
    border: "2px solid white",
    "&:hover": {
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    display: "none",
  },
}));

export default function PriceRangeSlider({ min, max, value, onChange }) {
  const [priceRange, setPriceRange] = useState(value || [min, max]);

  const handleChange = (_event, newValue) => {
    setPriceRange(newValue);
    onChange?.(newValue); // Ensure callback is triggered
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
          value={priceRange}
          min={min}
          max={max}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="price-range-slider"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography sx={{ fontSize: "12px" }} color="text.secondary">
            <p>Min</p>
            {formatPrice(priceRange[0]).toLocaleString()}
          </Typography>

          <Typography sx={{ fontSize: "12px" }} color="text.secondary">
            <p>Max</p>
            {formatPrice(priceRange[1]).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
