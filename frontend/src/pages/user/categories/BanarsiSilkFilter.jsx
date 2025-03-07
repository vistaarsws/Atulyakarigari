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
import toHex from "colornames";
import { Transform } from "@mui/icons-material";

const extractColors = (categoryData) => {
  const colorsSet = new Set();

  categoryData?.products?.forEach((product) => {
    if (Array.isArray(product.attributes)) {
      product.attributes.forEach((attr) => {
        if (attr.key.toLowerCase().includes("color")) {
          let colorValues = Array.isArray(attr.value)
            ? attr.value
            : [attr.value];

          colorValues.forEach((color) => {
            color
              .replace(/[\[\]]/g, "") // Remove brackets []
              .split(/,|\/|&/) // Split by comma, slash, or "&"
              .map((c) => c.trim().toLowerCase()) // Trim and lowercase
              .forEach((c) => colorsSet.add(c)); // Add to Set
          });
        }
      });
    }
  });

  return Array.from(colorsSet);
};

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
    padding: "8px",
    borderBottom: "1px solid #E5E7EB",
    position: "sticky",
    top: 0,
  
    backgroundColor: "#fff",
    zIndex: 10,
  },
  backButton: {
    padding: "8px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#F3F4F6",
    },
  },
  title: {
    fontSize: "12px",
    fontWeight: 400,
    color: "#383737",
    flexGrow: 1,
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
    border: "1px solid #E5E7EB",
    marginRight: "8px",
  },
  buttonContainer: {
    position: "sticky",
    bottom: 0,
    backgroundColor: "#fff",
    padding: "16px",
    borderTop: "1px solid #E5E7EB",
    display: "flex",
    gap: "12px",
    flexDirection: { xs: "column", sm: "row" },
  },
  applyButton: {
    backgroundColor: "#60a487",
    color: "white",
    flex: { xs: "1", sm: "1" },
    padding: "10px 20px",
    "&:hover": {
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
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
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [availableColors, setAvailableColors] = useState([]);

  const [tempFilters, setTempFilters] = useState({
    inStock: false,
    selectedColors: [],
    priceRange: [0, 100000],
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (categoryData) {
      setAvailableColors(extractColors(categoryData));
    }
  }, [categoryData]);

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
  const getBaseColor = (colorName) => {
    const words = colorName.split(" ");
    if (words.length > 1) {
      return toHex(words[words.length - 1]) || toHex(words[0]) || "#808080";
    }
    return toHex(colorName) || "#808080";
  };
  // Extract colors from product attributes
  const getProductColors = (product) => {
    let productColors = [];

    if (Array.isArray(product.attributes)) {
      product.attributes.forEach((attr) => {
        if (attr.key.toLowerCase().includes("color")) {
          // Ensure `value` is always treated as an array
          const colors = Array.isArray(attr.value) ? attr.value : [attr.value];

          // Convert colors to lowercase and add them to the list
          productColors = [
            ...productColors,
            ...colors.map((c) => c.toLowerCase()),
          ];
        }
      });
    }

    return productColors;
  };

  const handleApplyFilters = () => {
    setInStock(tempFilters.inStock);
    setSelectedColors(tempFilters.selectedColors);
    setPriceRange(tempFilters.priceRange);

    const filteredProducts = categoryData?.products?.filter((product) => {
      const matchesStock =
        !tempFilters.inStock || (product.stock && product.stock > 0);

      const productPrice = product.priceAfterDiscount ?? product.price ?? 0;
      const matchesPrice =
        productPrice >= tempFilters.priceRange[0] &&
        productPrice <= tempFilters.priceRange[1];

      const productColors = getProductColors(product);
      const matchesColor =
        tempFilters.selectedColors.length === 0 ||
        tempFilters.selectedColors.some((color) => {
          if (color.split(" ").length > 1) {
            // If color name has multiple words (specific shade), match exactly
            return productColors.includes(color.toLowerCase());
          } else {
            // If it's a general color, allow partial matches
            return productColors.some((prodColor) =>
              prodColor.includes(color.toLowerCase())
            );
          }
        });

      const isPublished = product.status === "Published";

      return matchesStock && matchesPrice && matchesColor && isPublished;
    });

    if (
      JSON.stringify(filteredProducts) !== JSON.stringify(categoryData.products)
    ) {
      onFilterChange && onFilterChange(filteredProducts);
    }

    if (isMobile) {
      setIsToggled(false);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      inStock: false,
      selectedColors: [],
      priceRange: [0, 100000],
    };
    setTempFilters(defaultFilters);
    setInStock(false);
    setSelectedColors([]);
    setPriceRange([0, 100000]);
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
              `${categoryData.parentCategory.name} / `}
            {categoryData?.name}
          </Typography>
          <Box
            sx={sidebarStyles.filterToggle}
            style={{
              display: useMediaQuery("(max-width: 768px)") ? "flex" : "none",
            }}
          >
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
              {availableColors.map((color) => {
                // Convert color name to hex and provide a fallback if undefined
                const hexColor = toHex(color) || "#808080";

                return (
                  <Box key={color} sx={sidebarStyles.colorItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="large"
                          checked={tempFilters.selectedColors.includes(color)}
                          onChange={() => toggleColor(color)}
                          sx={{
                            "&.Mui-checked": {
                              "& .MuiSvgIcon-root": { color: "#10B981" },
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {/* Color Swatch */}
                          <Box
                            sx={{
                              ...sidebarStyles.colorSwatch,
                              backgroundColor: getBaseColor(color), // Updated color logic
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: "#383737",
                              textTransform: "capitalize",
                            }}
                          >
                            {color}
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
                );
              })}
            </Box>
          </Box>
          ;
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
