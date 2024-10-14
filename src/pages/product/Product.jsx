import { useParams } from "react-router-dom";
import ProductView from "../../components/layout/productView/productView";
import share from "../../assets/images/share.svg";
import star from "../../assets/images/reviewStar.svg";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import about_artisan from "../../assets/images/about_artisan.png";
import review_person from "../../assets/images/reviewPerson.png";
import {
  Avatar,
  Box,
  Typography,
  Rating,
  Stack,
  useMediaQuery,
} from "@mui/material";

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

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Category", href: "/category" },
    { title: "Subcategory", href: "/subcategory" },
  ];

  const items = breadcrumbItems.map((item, index) => ({
    title:
      index === breadcrumbItems.length - 1 ? (
        <span style={{ color: "#1890ff" }}>{item.title}</span> // Highlight the last item
      ) : (
        item.title
      ),
    href: item.href,
  }));

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

  return (
    <div className="product_container">
      <div>
        <Breadcrumb items={items} />
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
                  <span>4</span> <img src={star} alt="Star" />
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
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                overflow: "scroll",
                scrollbarWidth: "none",

                width: useMediaQuery("(max-width:600px)") ? "80vw" : "100%",
              }}
            >
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChange}
                aria-label="basic tabs example"
                className="Product_tab_items"
              >
                <Tab label="About Artisan" {...a11yProps(0)} />
                <Tab label="Detail Description" {...a11yProps(1)} />
                <Tab label="Reviews" {...a11yProps(2)} />
                <Tab label="Questions" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="about_artisan">
                <figure>
                  <img src={about_artisan} alt="About Artisan" />
                </figure>
                <div>
                  <h3>Khilesh Sahu</h3>
                  <p>
                    Khilesh Sahu is a master artisan specializing in the
                    intricate art of sari-making. With over [number] years of
                    experience, Khilesh has developed a signature style that
                    blends traditional craftsmanship with contemporary design.
                    Each sari is handwoven using fine materials such as silk,
                    cotton, and linen, showcasing exquisite patterns inspired by
                    [cultural references or regions]. Passionate about
                    preserving the rich heritage of Indian textiles,{" "}
                  </p>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="detail_description">
                <ul>
                  <li>
                    <h3>Wash Care</h3>
                    <p>
                      Cotton Fabric -First wash dry clean and after that gentle
                      machine wash. Silk Fabric- Dry clean only. Home decor
                      -clean with a dry/damp cloth. For any other product -
                      Please find the wash care in the product description.
                    </p>
                  </li>
                  <li>
                    <h3>7 Days free return</h3>
                    <p>
                      Product(s) can be exchanged within 7 days from the date of
                      purchase. On SALE and CUSTOMISED product - No Return
                      /Refund
                    </p>
                  </li>
                  <li>
                    <h3>Shipping</h3>
                    <p>
                      Free shipping within India. Shipping out of India is as
                      per weight calculation at checkout. Packing: Atulya
                      Karigari ensures to provide the finest packing with proper
                      safety of the products intact.
                    </p>
                  </li>
                </ul>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <div className="reviews_section">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    borderBottom: "1px solid #e0e0e0",

                    width: "100%",
                  }}
                >
                  <Avatar
                    alt="Priya Sharma"
                    src={review_person}
                    sx={{ width: 56, height: 56, marginBottom: "auto" }}
                  />

                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating name="read-only" value={5} readOnly />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "1.2rem" }}
                      >
                        - Priya Sharma, 30-09-2024
                      </Typography>
                    </Stack>

                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Wearing a Banarsi sari feels like draping a piece of
                      heritage. The craftsmanship and elegance are unmatched.
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Soluta eum officiis, facere libero esse sit commodi odio
                      autem nihil aliquid odit atque minus possimus magni
                    </Typography>
                  </Box>
                </Box>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
              <div className="ask_question">
                <div>
                  <input
                    type="text"
                    placeholder="Ask any question here"
                  ></input>
                  <button>Submit</button>
                </div>
              </div>
            </CustomTabPanel>
          </article>
        </section>
      </div>
    </div>
  );
}
