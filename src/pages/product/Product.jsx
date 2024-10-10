import { useParams } from "react-router-dom";
import ProductView from "../../components/layout/productView/productView";
import share from "../../assets/images/share.svg";
import star from "../../assets/images/reviewStar.svg";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import "./Product.css";
import WishListHeartIcon from "../../components/ui/micro_elements/wishListHeartIcon/wishListHeartIcon";
import { useState } from "react";

// ----------------------------------------------------------------------------------------
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
// ----------------------------------------------------------------------------------------
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Product() {
  let { userId } = useParams();

  const [productQuantity, setProductQuantity] = useState(0);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const product_description = {
    properties: [
      { type: "Occasion", value: "Festive/ Party/ Corporate" },
      { type: "Saree Length", value: "5.50 meter" },
      { type: "Fabric Care", value: "Dry clean only" },
      { type: "Colour", value: "Red (Sindoor)" },
      { type: "Fabric", value: "Pure Raw Silk" },
      { type: "Style", value: "Floral pattern with gota patti pallu" },
      { type: "Type", value: "Pure Silk" },
      { type: "Weight", value: "500 gm" },
      { type: "Blouse", value: "1 Meter unstitched blouse fabric" },
      { type: "Dimensions", value: "35.56 × 6.35 × 35.56 cm" },
    ],
  };

  const breadcrumbItems = [
    {
      href: "/",
      title: <HomeOutlined />,
    },
    {
      href: "",
      title: "Handloom",
    },
    {
      href: "",
      title: "Lehenga",
    },
    {
      href: "",
      title: "Banarsi",
    },
  ];

  return (
    <div className="product_container">
      <div>
        <Breadcrumb>
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item key={index} href={item.href}>
              {index === breadcrumbItems.length - 1 ? (
                <span style={{ color: "#1890ff" }}>{item.title}</span> // Highlight the last item
              ) : (
                item.title
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      <div>
        <section>
          <ProductView />
        </section>
        <section className="product_details_header">
          <div>
            <h1>Banarsi Nikhaar</h1>
            <div>
              <WishListHeartIcon />
              <figure>
                <img src={share} alt="Share" />
              </figure>
            </div>
          </div>
          <p>
            Banarasi silk fabric is a fine quality silk variant originating from
            Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the
            rich history of India. Saree woven from silk is known as Banarasi
            silk Saree, which is an extremely famous fabric all over India and
            the world.
          </p>
          <div className="priceRatingContainer">
            <div>
              <div className="priceBox"> ₹ 26,700</div>
              <div className="ratingBox">
                <div>
                  4 <img src={star} alt="Star" />
                </div>
                <div>161 Rating</div>
              </div>
              <div className="pincodeBox">
                <div>
                  <input
                    type="number"
                    name="pincode"
                    id="pincode"
                    placeholder="Enter Pincode"
                  />
                </div>
                <div>
                  <button type="button">Check Pincode</button>
                </div>
              </div>
            </div>
          </div>
          <article className="product_details_description">
            <h2>Product Description</h2>
            <ul>
              {product_description.properties.map((property, index) => {
                return (
                  <li key={index}>
                    <div>{property.type}</div>
                    <div>{property.value}</div>
                    <div className="bottomLine"></div>
                  </li>
                );
              })}
            </ul>
          </article>
          <article className="product_details_userInputs">
            <div className="productQuantityCounter_container">
              <button onClick={() => setProductQuantity(productQuantity + 1)}>
                +
              </button>
              <div>{productQuantity}</div>
              <button
                onClick={() =>
                  productQuantity > 1 && setProductQuantity(productQuantity - 1)
                }
              >
                -
              </button>
            </div>
            <div>
              <button>Buy Now</button>
            </div>
            <div>
              <button>Add To Cart</button>
            </div>
          </article>
          <article className="tabView_container">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="About Artisan" {...a11yProps(0)} />
                <Tab label="Detail Description" {...a11yProps(1)} />
                <Tab label="Reviews" {...a11yProps(2)} />
                <Tab label="Questions" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel>
          </article>
        </section>
      </div>
    </div>
  );
}
