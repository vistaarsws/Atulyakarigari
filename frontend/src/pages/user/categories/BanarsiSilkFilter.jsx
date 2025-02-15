import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PriceRangeSlider from "./PriceRangeSlider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./CategoryPage.css";
import toggleArrow from "../../../assets/images/left-arrow-return-svgrepo-com.svg";
import toggleFilter from "../../../assets/images/filter-list-svgrepo-com.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "Alizarin Crimson", hex: "#E32636" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Teal", hex: "#008080" },
  { name: "Pale Turquoise", hex: "#AFEEEE" },
  { name: "Goldenrod", hex: "#DAA520" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Sea Green", hex: "#2E8B57" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Red", hex: "#FF0000" },
];

const sidebarStyles = {
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 10,
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
    flexGrow: 1,
    marginLeft: "8px",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: { xs: "16px", sm: "24px" },
  },
  section: {
    marginBottom: "24px",
    position: "relative",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#383737",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  colorItem: {
    display: "flex",
    alignItems: "center",
  },
  colorSwatch: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    marginRight: "8px",
  },
  buttonContainer: {
    position: "sticky",
    bottom: 0,
    backgroundColor: "#fff",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "12px",
    flexDirection: { xs: "column", sm: "row" },
  },
  applyButton: {
    backgroundColor: "#10B981",
    color: "white",
    flex: { xs: "1", sm: "1" },
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: "#059669",
    },
  },
  resetButton: {
    color: "#374151",
    borderColor: "#D1D5DB",
    flex: { xs: "1", sm: "1" },
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: "#F3F4F6",
      borderColor: "#9CA3AF",
    },
  },
  filterToggle: {
    display: { sm: "flex", md: "none" },
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },
};

export default function SidebarFilter({ categoryData, onFilterChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [inStock, setInStock] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([2000, 30000]);
  const [tempFilters, setTempFilters] = useState({
    inStock: false,
    selectedColors: [],
    priceRange: [2000, 30000],
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTempFilters({
      inStock,
      selectedColors,
      priceRange,
    });
  }, [inStock, selectedColors, priceRange]);

  const toggleColor = (colorName) => {
    setTempFilters((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter((c) => c !== colorName)
        : [...prev.selectedColors, colorName],
    }));
  };

  const handlePriceChange = (newRange) => {
    setTempFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  const handleStockChange = (event) => {
    setTempFilters((prev) => ({
      ...prev,
      inStock: event.target.checked,
    }));
  };

  const handleApplyFilters = () => {
    setInStock(tempFilters.inStock);
    setSelectedColors(tempFilters.selectedColors);
    setPriceRange(tempFilters.priceRange);

    const filteredProducts = categoryData?.products?.filter((product) => {
      // Stock Availability Check
      const matchesStock =
        !tempFilters.inStock ||
        (product.inStock !== undefined && product.inStock);

      // Price Range Check
      const productPrice = product?.price || 0;
      const matchesPrice =
        productPrice >= tempFilters.priceRange[0] &&
        productPrice <= tempFilters.priceRange[1];

      // Color Matching Check (Handles case-insensitive matching)
      const productColor = product?.color?.toLowerCase() || "";
      const matchesColor =
        tempFilters.selectedColors.length === 0 ||
        tempFilters.selectedColors.some(
          (color) => color.toLowerCase() === productColor
        );

      return matchesStock && matchesPrice && matchesColor;
    });

    if (onFilterChange) {
      onFilterChange(filteredProducts);
    }

    if (isMobile) {
      setIsToggled(false);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      inStock: false,
      selectedColors: [],
      priceRange: [2000, 30000],
    };

    setTempFilters(defaultFilters);
    setInStock(false);
    setSelectedColors([]);
    setPriceRange([2000, 30000]);

    if (onFilterChange) {
      onFilterChange(categoryData?.products || []);
    }
  };

  return (
    <div
      className={`filterSection_container ${isToggled ? "toggleSideBar" : ""}`}
    >
      <Box sx={sidebarStyles.container}>
        {/* Header */}
        <Box sx={sidebarStyles.header}>
          <IconButton
            sx={sidebarStyles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              style={{ width: 24, height: 24, color: "#000000" }}
            />
          </IconButton>
          <Typography sx={sidebarStyles.title}>
            {categoryData?.parentCategory?.name &&
              `${categoryData.parentCategory.name}/`}
            {categoryData?.name}
          </Typography>

          <Box sx={sidebarStyles.filterToggle}>
            <img
              src={isToggled ? toggleArrow : toggleFilter}
              alt="Toggle Filter"
              onClick={() => setIsToggled(!isToggled)}
              style={{ cursor: "pointer", width: 24, height: 24 }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={sidebarStyles.content}>
          {/* Stock Filter */}
          <Box sx={sidebarStyles.section}>
            <Typography sx={sidebarStyles.sectionTitle}>
              In Stock
              <Checkbox
                checked={tempFilters.inStock}
                onChange={handleStockChange}
                disableRipple
                size="large"
                sx={{
                  "&.Mui-checked": {
                    "& .MuiSvgIcon-root": { color: "#10B981" },
                  },
                }}
              />
            </Typography>
          </Box>

          {/* Price Range Slider */}
          <Box sx={sidebarStyles.section}>
            <PriceRangeSlider
              min={1}
              max={100000}
              value={tempFilters.priceRange}
              onChange={handlePriceChange}
            />
          </Box>

          {/* Color Filter */}
          <Box sx={sidebarStyles.section}>
            <Typography sx={sidebarStyles.sectionTitle}>Colors</Typography>
            <Box sx={sidebarStyles.colorList}>
              {colors.map((color, index) => (
                <Box key={color.name + index} sx={sidebarStyles.colorItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="large"
                        checked={tempFilters.selectedColors.includes(
                          color.name
                        )}
                        onChange={() => toggleColor(color.name)}
                        sx={{
                          "&.Mui-checked": {
                            "& .MuiSvgIcon-root": { color: "#10B981" },
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            ...sidebarStyles.colorSwatch,
                            backgroundColor: color.hex,
                          }}
                        />
                        <Typography sx={{ fontSize: "14px", color: "#383737" }}>
                          {color.name}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      "&.MuiFormControlLabel-root": {
                        margin: 0,
                        boxShadow: "none !important",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Fixed Bottom Buttons */}
        <Box sx={sidebarStyles.buttonContainer}>
          <Button
            variant="contained"
            sx={sidebarStyles.applyButton}
            onClick={handleApplyFilters}
            fullWidth={isMobile}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            sx={sidebarStyles.resetButton}
            onClick={handleResetFilters}
            fullWidth={isMobile}
          >
            Reset All
          </Button>
        </Box>
      </Box>
    </div>
  );
}
