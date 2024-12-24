import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AdminProductCard from "../../../components/ui/admin/product-card/AdminProductCard";
// import TableHeader from "./TableHeader"; // Import your TableHeader component

import { useState } from "react";
import "./Products.css";

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
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const productData = await getProducts();
      setProducts(productData.data.data.products);
      console.log(productData.data.data.products, "asdas");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      className="adminProduct_container"
      sx={{ width: "100%", bgcolor: "#fbfbfb" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label={`All (62)`} {...a11yProps(0)} />
          <Tab label={`Published (80)`} {...a11yProps(1)} />
          <Tab label={`Draft (110)`} {...a11yProps(2)} />
          <Tab label={`Out Of Stock (1000)`} {...a11yProps(3)} />
        </Tabs>
      </Box>
      <Box></Box>
      <CustomTabPanel value={value} index={0}>
        <AdminProductCard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AdminProductCard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AdminProductCard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <AdminProductCard />
      </CustomTabPanel>
    </Box>
  );
}

const Items = () => {};
