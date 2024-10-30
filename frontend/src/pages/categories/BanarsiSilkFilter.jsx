import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  
} from "@mui/material";
import PriceRangeSlider from "./PriceRangeSlider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./CategoryPage.css";
import toggleArrow from "../../assets/images/left-arrow-return-svgrepo-com.svg";
import toggleFilter from "../../assets/images/filter-list-svgrepo-com.svg";
import { useState } from "react";

const colors = [
  { name: "Alizarin Crimson", hex: "#E32636", selected: true },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Teal", hex: "#008080" },
  { name: "Lavender Blush", hex: "#FFF0F5", selected: true },
  { name: "Pale Turquoise", hex: "#AFEEEE" },
  { name: "Goldenrod", hex: "#DAA520" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Sea Green", hex: "#2E8B57" },
  { name: "Alizarin Crimson", hex: "#E32636", selected: true },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Teal", hex: "#008080" },
  { name: "Lavender Blush", hex: "#FFF0F5", selected: true },
  { name: "Pale Turquoise", hex: "#AFEEEE" },
  { name: "Goldenrod", hex: "#DAA520" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Sea Green", hex: "#2E8B57" },
];

const sidebarStyles = {
  container: {
    backgroundColor: "#fff",
    width: "100%",
    // borderRight: "1px solid #e5e7eb",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "32px",
  },
  backButton: {
    padding: "8px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  title: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#383737",
    lineHeight: "22px",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#383737",
    marginTop: "26px",
  },
  colorList: {
    display: "flex",
    flexDirection: "column",
    // gap: "12px",
  },
  colorItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  colorSwatch: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    marginRight: "8px",
  },
};

export default function SidebarFilter() {
  const [inStock, setInStock] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedColors, setSelectedColors] = useState(
    colors.filter((c) => c.selected).map((c) => c.name)
  );

  const toggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handlePriceChange = (value) => {
    console.log("Price changed:", value);
  };

  return (
    <div
      className={`filterSection_container ${isToggled ? "toggleSideBar" : ""}`}
    >
      <Box sx={sidebarStyles.container}>
        {/* Header */}
        <Box sx={sidebarStyles.header}>
          <IconButton sx={sidebarStyles.backButton}>
            <ArrowBackIcon
              style={{
                width: 24,
                height: 24,
                color: "#000000",
              }}
            />
          </IconButton>
          <Typography sx={sidebarStyles.title}>Banarsi Silk</Typography>
        </Box>
        <Box sx={{ marginLeft: "2rem" }}>
          {/* Stock Filter */}
          <Box sx={sidebarStyles.section}>
            <Typography sx={sidebarStyles.sectionTitle}>Stock</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  disableRipple
                  size="large"
                  sx={{
                    "&.Mui-checked": {
                      "& .MuiSvgIcon-root": {
                        color: "#10B981",
                      },
                    },
                  }}
                />
              }
              label="In Stock"
              sx={{
                "&.MuiFormControlLabel-root": {
                  boxShadow: "none !important",
                },
                "& .MuiFormControlLabel-label": {
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "300",
                  lineHeight: "21px",
                },
              }}
            />
          </Box>
          {/* price slider */}
          <PriceRangeSlider
            min={2000}
            max={30000}
            onChange={handlePriceChange}
          />
          {/* Color Filter */}
          <Box sx={sidebarStyles.section}>
            <Typography sx={sidebarStyles.sectionTitle}>Color</Typography>
            <Box sx={sidebarStyles.colorList}>
              {colors.map((color) => (
                <Box key={color.name} sx={sidebarStyles.colorItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="large"
                        checked={selectedColors.includes(color.name)}
                        onChange={() => toggleColor(color.name)}
                        sx={{
                          "&.Mui-checked": {
                            "& .MuiSvgIcon-root": {
                              color: "#10B981",
                            },
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          // gap: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            ...sidebarStyles.colorSwatch,
                            backgroundColor: color.hex,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 100,
                            color: "#383737",
                          }}
                        >
                          {color.name}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      "&.MuiFormControlLabel-root": {
                        boxShadow: "none !important",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <div
        className={`${
          isToggled ? "filterIconBoxClosed" : "filterIconBoxOpened"
        }`}
      >
        <figure className={`toggleImg_container `}>
          <img
            src={isToggled ? toggleFilter : toggleArrow}
            alt="Toggle Arrow"
            onClick={() => setIsToggled(!isToggled)}
          />
        </figure>
      </div>
    </div>
  );
}
