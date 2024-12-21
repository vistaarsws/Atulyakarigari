import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AdminProductCard from "../../../components/ui/admin/product-card/AdminProductCard";
// import TableHeader from "./TableHeader"; // Import your TableHeader component

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
        All
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Published
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Draft
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <AdminProductCard />
      </CustomTabPanel>
    </Box>
  );
}

const Items = () => {};
