import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import AdminProductCard from "../../../components/ui/admin/product-card/AdminProductCard";
import { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../Redux/features/ProductSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Updated CSS with better responsive behavior
const searchStyles = `
.search-container {
  position: relative;
  transition: all 0.3s ease;
  margin: 12px 0;
}

.search-field {
  transition: width 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  width: 250px;
  border-radius: 20px;
}

.search-field.focused {
  width: 350px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-field.has-content {
  background-color: #f8f9fa;
}

.search-icon {
  color: #666;
  transition: color 0.2s ease;
}

.search-field.focused .search-icon {
  color: #3F51B5;
}

.clear-button {
  transition: all 0.2s ease;
}

.clear-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.search-results-info {
  font-size: 0.85rem;
  color: #666;
  margin: 4px 0 0 8px;
  padding: 4px 8px;
  background-color: #f0f4f8;
  border-radius: 8px;
  display: inline-block;
  animation: fadeIn 0.3s ease;
}

.tabs-search-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 0 0;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .tabs-search-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 16px;
  }
  
  .search-container {
    width: 100%;
    margin: 12px 0 8px 0;
  }
  
  .search-field, .search-field.focused {
    width: 100%;
  }
  
  .MuiTabs-root {
    max-width: 100%;
    overflow-x: auto;
  }
}

/* Small tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .search-field {
    width: 200px;
  }
  
  .search-field.focused {
    width: 280px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Products() {
  const [value, setValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Add this to inject the CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = searchStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const allProducts = useSelector((state) => state.products.products || []);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const draftedProducts = allProducts?.filter(
    (prod) => prod && prod.status === "Draft"
  ) || [];
  
  const publishedProducts = allProducts?.filter(
    (prod) => prod && prod.status === "Published"
  ) || [];
  
  const outOfStock = allProducts?.filter(
    (prod) => prod && prod.stock === 0
  ) || [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  

  return (
    <Box
      className="adminProduct_container"
      sx={{ width: "100%", bgcolor: "#fbfbfb" }}
    >
      <Box 
        className="tabs-search-container"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="product tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            '& .MuiTab-root': {
              minWidth: isMobile ? 'auto' : 100,
              padding: isMobile ? '8px 10px' : '12px 16px',
              fontSize: isMobile ? '0.8rem' : '0.875rem',
            }
          }}
        >
          <Tab label={`All (${allProducts?.length || 0})`} {...a11yProps(0)} />
          <Tab
            label={`Published (${publishedProducts?.length || 0})`}
            {...a11yProps(1)}
          />
          <Tab label={`Draft (${draftedProducts?.length || 0})`} {...a11yProps(2)} />
          <Tab
            label={`Out Of Stock (${outOfStock?.length || 0})`}
            {...a11yProps(3)}
          />
        </Tabs>
        <div className="search-container">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`search-field ${isFocused ? 'focused' : ''} ${searchQuery ? 'has-content' : ''}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="search-icon" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <Fade in={true}>
                    <IconButton 
                      size="small" 
                      onClick={handleClearSearch}
                      className="clear-button"
                      sx={{ 
                        padding: '4px',
                        color: '#666',
                        '&:hover': { color: '#000' }
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Fade>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                '&.Mui-focused': {
                  borderColor: '#3F51B5'
                }
              }
            }}
            sx={{ 
              width: isMobile ? '100%' : (isFocused ? (isTablet ? '280px' : '350px') : (isTablet ? '200px' : '250px')),
              transition: 'width 0.3s ease',
            }}
          />
         
        </div>
      </Box>
      <Box>
        <CustomTabPanel value={value} index={0}>
          <AdminProductCard productStatus={"all"} searchQuery={searchQuery} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AdminProductCard productStatus={"published"} searchQuery={searchQuery} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AdminProductCard productStatus={"draft"} searchQuery={searchQuery} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <AdminProductCard productStatus={"outofstock"} searchQuery={searchQuery} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}